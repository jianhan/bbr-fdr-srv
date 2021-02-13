import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Prop } from '@nestjs/mongoose';
import { Link } from '../../models/Link';

export class Overall {
  @IsOptional()
  @Prop()
  leagueChampion?: Link;

  @IsOptional()
  @ValidateNested()
  @Prop()
  mostValuablePlayer?: Link;

  @IsOptional()
  @ValidateNested()
  @Prop()
  rookieOfTheYear?: Link;

  @IsNotEmpty()
  @Prop({ required: true })
  ppgLeader: Link;

  @IsNotEmpty()
  @Prop({ required: true })
  rpgLeader: Link;

  @IsNotEmpty()
  @Prop({ required: true })
  apgLeader: Link;

  @IsNotEmpty()
  @Prop({ required: true })
  wsLeader: Link;
}
