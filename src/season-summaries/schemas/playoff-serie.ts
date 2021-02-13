import { Link } from '../../models/Link';
import { Prop } from '@nestjs/mongoose';
import { IsArray, IsInt, IsNotEmpty, IsOptional, Max, Min, ValidateNested } from 'class-validator';
import { PlayoffSerieGame } from './playoff-serie-game';

export class PlayoffSerie {
  @IsNotEmpty()
  @Prop()
  teamWon: Link;

  @IsNotEmpty()
  @Prop()
  teamLose: Link;

  @IsNotEmpty()
  @Prop()
  seriesStats: Link;

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

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Prop([PlayoffSerieGame])
  westernConferenceFirstRound?: PlayoffSerieGame[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Prop([PlayoffSerieGame])
  easternConferenceFirstRound?: PlayoffSerieGame[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Prop([PlayoffSerieGame])
  westernConferenceSemifinals?: PlayoffSerieGame[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Prop([PlayoffSerieGame])
  easternConferenceSemifinals?: PlayoffSerieGame[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Prop([PlayoffSerieGame])
  westernConferenceFinals?: PlayoffSerieGame[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Prop([PlayoffSerieGame])
  easternConferenceFinals?: PlayoffSerieGame[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Prop([PlayoffSerieGame])
  finals?: PlayoffSerieGame[];
}
