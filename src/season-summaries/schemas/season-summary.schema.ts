import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Link } from '../../models/Link';
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsUrl, ValidateNested } from 'class-validator';
import { DivisionStandings } from './division-standings';
import { PlayoffSerie } from './playoff-serie';
import { ConferenceStandings } from './conference-standings';
import { GameStat } from './game-stat';
import { TeamPerGameStat } from '../types';
import { Overall } from './overall';

type SeasonSummaryDocument = SeasonSummary & Document;

@Schema({ collection: 'season-summaries', timestamps: true })
class SeasonSummary {
  @IsNumber()
  @IsNotEmpty()
  @Prop({ required: true })
  year: number;

  @IsUrl()
  @Prop({ required: true })
  url: string;

  @ValidateNested()
  @IsNotEmpty()
  @Prop({ required: true })
  overall: Overall;

  @ValidateNested()
  @IsOptional()
  @Prop()
  conferenceStandings?: ConferenceStandings;

  @ValidateNested()
  @IsOptional()
  @Prop()
  divisionStandings?: DivisionStandings;

  @ValidateNested()
  @IsOptional()
  @IsArray()
  @Prop()
  playoffSerie?: PlayoffSerie[];

  @IsNotEmpty()
  @Prop({ type: Array, of: Object, required: true })
  teamPerGameStats: TeamPerGameStat[];

  @IsNotEmpty()
  @Prop({ type: Array, of: Object, required: true })
  opponentPerGameStats: TeamPerGameStat[];

  @IsNotEmpty()
  @Prop({ type: Array, of: Object, required: true })
  teamStats: TeamPerGameStat[];

  @IsNotEmpty()
  @Prop({ type: Array, of: Object, required: true })
  opponentStats: TeamPerGameStat[];

  @IsNotEmpty()
  @Prop({ type: Array, of: Object, required: true })
  teamPer100PossStats: TeamPerGameStat[];

  @IsNotEmpty()
  @Prop({ type: Array, of: Object, required: true })
  opponentPer100PossStats: TeamPerGameStat[];

  @IsNotEmpty()
  @Prop({ required: true })
  html: string;

  @IsNotEmpty()
  @IsDate()
  @Prop({ type: Date, required: true, default: new Date() })
  lastSyncedAt: Date;
}

const SeasonSummarySchema = SchemaFactory.createForClass(SeasonSummary);
SeasonSummarySchema.index({ year: 1 }, { unique: true });

export { SeasonSummaryDocument, SeasonSummary, SeasonSummarySchema };
