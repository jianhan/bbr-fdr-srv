import { Link } from '../../models/Link';
import { Prop } from '@nestjs/mongoose';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class PlayoffSerieGame {
  @IsNotEmpty()
  @Prop()
  game: Link;

  @IsString()
  @IsNotEmpty()
  @Prop()
  date: string;

  @IsString()
  @IsNotEmpty()
  @Prop()
  awayTeam: string;

  @IsInt()
  @Min(1)
  @Prop()
  awayTeamPoints: number;

  @IsString()
  @IsNotEmpty()
  @Prop()
  homeTeam: string;

  @IsInt()
  @Min(1)
  @Prop()
  homeTeamPoints: number;
}
