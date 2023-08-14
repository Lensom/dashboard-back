import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Portfolio } from '../models/portfolio.model';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel('Portfolio') private readonly portfolioModel: Model<Portfolio>,
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

      const filteredPortfolio = portfolio.map(({ ticker, stocks }) => ({
        ticker,
        stocks,
      }));

      return filteredPortfolio;
    } catch (error) {
      throw new NotFoundException('Portfolio not found');
    }
  }
}
