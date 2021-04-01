import { Link } from '../../models/Link';
import { Prop } from '@nestjs/mongoose';
import { IsArray, IsInt, IsNotEmpty, IsString, Max, Min, MinLength } from 'class-validator';
import { PlayoffSerieGame } from './playoff-serie-game';

export class PlayoffSerie {
  @IsNotEmpty()
  @IsString()
  @Prop()
  title: string;

  @IsNotEmpty()
  @Prop()
  teamWon: Link;

  @IsNotEmpty()
  @Prop()
  teamLose: Link;

  @IsNotEmpty()
  @Prop()
  stats: Link;

  @IsInt()
  @Min(3)
  @Max(4)
  @Prop()
  wonBy: number;

  @IsInt()
  @Min(0)
  @Max(3)
  @Prop()
  loseBy: number;

  @IsArray()
  @MinLength(1)
  @Prop()
  games: PlayoffSerieGame[];
}
