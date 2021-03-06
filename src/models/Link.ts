import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class Link {
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  title: string;

  @Prop()
  @IsUrl()
  href: string;

  @Prop({ type: [String] })
  data?: string[];
}
