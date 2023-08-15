import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockList } from './stock.model';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('all')
  getAllStockInfo(@Body() symbols: any) {
    return this.stockService.getAllStockInfo(symbols);
  }

  @Get(':symbol')
  getStockInfo(@Param('symbol') symbol: string): Promise<any> {
    return this.stockService.getStockInfo(symbol);
  }
}
