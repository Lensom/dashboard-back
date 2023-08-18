import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Delete,
  Param,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { Portfolio } from 'src/portfolio/portfolio.model';

interface ExtendedRequest extends Request {
  userId?: string;
}

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post('add-stock')
  addStockToPortfolio(
    @Body() newStocks: Portfolio,
    @Req() request: ExtendedRequest,
  ) {
    const userId = request.userId;

    return this.portfolioService.addStockToPortoflio(newStocks, userId);
  }

  @Get('')
  fetchPortfolio(@Req() request: ExtendedRequest) {
    const userId = request.userId;
    return this.portfolioService.fetchPortfolio(userId);
  }

  @Delete(':symbol')
  deleteStock(
    @Param('symbol') symbol: string,
    @Req() request: ExtendedRequest,
  ): Promise<any> {
    const userId = request.userId;
    return this.portfolioService.deleteStock(symbol, userId);
  }
}
