import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { Prop } from '@nestjs/mongoose';

export class GameStat {
  @IsNotEmpty()
  @IsNumber()
  @Prop()
  games: number;

  @IsNotEmpty()
  @IsNumber()
  @Prop()
  minutesPlayed: number;

  @IsNotEmpty()
  @IsNumber()
  @Prop()
  fieldGoals: number;

  @IsNotEmpty()
  @IsNumber()
  @Prop()
  fieldGoalAttempts: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1)
  @Prop()
  fieldGoalPercentage: number;

  @IsNotEmpty()
  @IsNumber()
  @Prop()
  twoPointFieldGoals: number;

  @IsNotEmpty()
  @IsNumber()
  @Prop()
  twoPointFieldGoalAttempts: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1)
  @Prop()
  twoPointFieldGoalPercentage: number;

  @IsNotEmpty()
  @IsNumber()
  @Prop()
  threePointFieldGoals: number;

  @IsNotEmpty()
  @IsNumber()
  @Prop()
  threePointFieldGoalAttempts: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1)
  @Prop()
  threePointFieldGoalPercentage: number;

  @IsNotEmpty()
  @IsNumber()
  @Prop()
  freeThrows: number;

  @IsNotEmpty()
  @IsNumber()
  @Prop()
  freeThrowAttempts: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1)
  @Prop()
  freeThrowPercentage: number;

  @IsNotEmpty()
  @IsNumber()
  @Prop()
  offensiveRebounds: number;

  @IsNotEmpty()
  @IsNumber()
  @Prop()
  defensiveRebounds: number;

  @IsNotEmpty()
  @IsNumber()
  @Prop()
  totalRebounds: number;

  @IsNotEmpty()
  @IsNumber()
  @Prop()
  assists: number;

  @IsNotEmpty()
  @IsNumber()
  @Prop()
  steals: number;

  @IsNotEmpty()
  @IsNumber()
  @Prop()
  blocks: number;

  @IsNotEmpty()
  @IsNumber()
  @Prop()
  turnovers: number;

  @IsNotEmpty()
  @IsNumber()
  @Prop()
  personalFouls: number;

  @IsNotEmpty()
  @IsNumber()
  @Prop()
  points: number;
}
