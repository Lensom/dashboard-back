import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PortfolioSchema } from 'src/portfolio/portfolio.model';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { StockModule } from 'src/stock/stock.module';

@Module({
  imports: [
    StockModule,
    MongooseModule.forFeature([
      {
        name: 'Portfolio',
        schema: PortfolioSchema,
      },
    ]),
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
