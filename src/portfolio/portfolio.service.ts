import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Portfolio } from './portfolio.model';

import { StockService } from 'src/stock/stock.service';
import { StockList } from 'src/stock/stock.model';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel('Portfolio') private readonly portfolioModel: Model<Portfolio>,
    private readonly stockService: StockService,
  ) {}

  async addStockToPortoflio(portfolio: Portfolio, userId: string) {
    try {
      portfolio.userId = userId;
      await this.portfolioModel.create(portfolio);
      const updatedPortfolio = await this.fetchPortfolio(userId);
      return updatedPortfolio;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async fetchPortfolio(userId: string) {
    try {
      const portfolio = await this.portfolioModel.find({ userId }).exec();

      const filteredPortfolio = portfolio.map(({ ticker, purchaseHistory }) => {
        const { totalCost, totalShares } = purchaseHistory.reduce(
          (accumulator, purchase) => {
            const count = purchase.count;
            const price = parseFloat(purchase.price);

            accumulator.totalCost += count * price;
            accumulator.totalShares += count;

            return accumulator;
          },
          { totalCost: 0, totalShares: 0 },
        );

        const avgPrice = Number((totalCost / totalShares).toFixed(2));

        return {
          ticker,
          purchaseHistory,
          totalShares,
          avgPrice,
          totalCost,
        };
      });

      const symbols = filteredPortfolio.map(({ ticker }) => ticker).join();

      const fullInfo = await this.stockService.getAllStockInfo({
        symbols,
      } as StockList);

      const fullPortfolio = filteredPortfolio.map((portfolio) => {
        const infoObj = fullInfo.find(
          (info) => info.symbol === portfolio.ticker,
        );

        const profitLossProcent =
          ((infoObj.regularMarketPrice - portfolio.avgPrice) /
            portfolio.avgPrice) *
          100;

        const profitLossUsd =
          (infoObj.regularMarketPrice - portfolio.avgPrice) *
          portfolio.totalShares;

        const choosedInfo = {
          name: infoObj.shortName,
          currentPrice: infoObj.regularMarketPrice,
          profitLossUsd: Number(profitLossUsd.toFixed(2)),
          profitLossProcent: Number(profitLossProcent.toFixed(2)),
          currentCost: Number(
            (infoObj.regularMarketPrice * portfolio.totalShares).toFixed(2),
          ),
        };

        return {
          ...portfolio,
          ...choosedInfo,
        };
      });

      return fullPortfolio;
    } catch (error) {
      throw new NotFoundException('Portfolio not found');
    }
  }

  async deleteStock(ticker: string, userId: string): Promise<any> {
    try {
      await this.portfolioModel.findOneAndDelete({ userId, ticker });
      return this.fetchPortfolio(userId);
    } catch (err) {
      throw new NotFoundException('Portfolio not found');
    }
  }
}
