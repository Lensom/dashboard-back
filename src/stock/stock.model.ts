import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class StockList extends Document {
  @Prop({
    type: String,
    required: true,
  })
  symbols: string;
}

export const StockListSchema = SchemaFactory.createForClass(StockList);
