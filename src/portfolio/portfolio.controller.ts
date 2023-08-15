import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { Portfolio } from 'src/portfolio/portfolio.model';

import { StockService } from 'src/stock/stock.service';
import { StockList } from 'src/stock/stock.model';

interface ExtendedRequest extends Request {
  userId?: string;
}

@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly stockService: StockService,
  ) {}

  @Post('add-stock')
  addStockToPortfolio(
    @Body() newStocks: Portfolio,
    @Req() request: ExtendedRequest,
  ) {
    const userId = request.userId;

    return this.portfolioService.addStockToPortoflio(newStocks, userId);
  }

  @Get('')
  async fetchPortfolio(@Req() request: ExtendedRequest) {
    const userId = request.userId;
    const userPortfolio = await this.portfolioService.fetchPortfolio(userId);

    const symbols = userPortfolio.map(({ ticker }) => ticker).join();

    const fullInfo = await this.stockService.getAllStockInfo({
      symbols,
    } as StockList);

    const fullPortfolio = userPortfolio.map((portfolio) => {
      const infoObj = fullInfo.find((info) => info.symbol === portfolio.ticker);

      const choosedInfo = {
        name: infoObj.shortName,
        currentPrice: infoObj.regularMarketPrice,
      };

      return {
        ...portfolio,
        ...choosedInfo,
      };
    });

    return fullPortfolio;
  }
}
