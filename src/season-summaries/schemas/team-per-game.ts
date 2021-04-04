import { Link } from '../../models/Link';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { Prop } from '@nestjs/mongoose';

export class TeamPerGame {
  @IsNotEmpty()
  @IsNumber()
  @Prop()
  rank: number;

  @IsNotEmpty()
  @Prop()
  team: Link;

  @IsBoolean()
  @Prop()
  isPlayoffTeam: boolean;
}
