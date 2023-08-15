import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { StockListSchema } from './stock.model'; // Import the StockList model

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Stock', schema: StockListSchema }]),
  ],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
