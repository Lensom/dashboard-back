import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Portfolio extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  ticker: string;

  @Prop({
    type: [{ count: Number, date: String, price: String }],
    required: true,
  })
  buyHistory: Array<{ count: number; date: string; price: string }>;

  @Prop({ required: true })
  userId: string;

  @Prop()
  count: 0;
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
