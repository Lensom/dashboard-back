import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { baseStockUrl } from 'src/config';
import { StockList } from './stock.model';

@Injectable()
export class StockService {
  constructor(@InjectModel('Stock') private stockListModel: Model<StockList>) {}

  async getStockInfo(symbol: string): Promise<any> {
    const headers = {
      'X-RapidAPI-Host': baseStockUrl,
      'X-RapidAPI-Key': process.env.YAHOO_API_KEY,
    };

    const url = `https://${baseStockUrl}/stock/v2/get-summary?symbol=${symbol}&region=US`;

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching stock info: ${error.message}`);
    }
  }

  async getAllStockInfo(stocks: StockList): Promise<any> {
    const headers = {
      'X-RapidAPI-Host': baseStockUrl,
      'X-RapidAPI-Key': process.env.YAHOO_API_KEY,
    };

    const url = `https://${baseStockUrl}/market/v2/get-quotes`;

    try {
      const response = await axios.get(url, {
        headers,
        params: {
          region: 'US',
          symbols: stocks.symbols,
        },
      });

      const {
        quoteResponse: { result },
      } = response.data;

      return result;
    } catch (error) {
      throw new Error(`Error fetching stock info: ${error.message}`);
    }
  }
}
