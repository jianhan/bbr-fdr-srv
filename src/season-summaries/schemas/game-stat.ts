import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { Prop } from '@nestjs/mongoose';

export class GameStat {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop()
  games: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop()
  minutesPlayed: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop()
  fieldGoals: number;

  @Prop()
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  fieldGoalAttempts: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsNotEmpty()
  @Prop()
  fieldGoalPercentage: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop()
  threePointFieldGoals: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop()
  threePointFieldGoalAttempts: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsNotEmpty()
  @Prop()
  threePointFieldGoalPercentage: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop()
  twoPointFieldGoals: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop()
  twoPointFieldGoalAttempts: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsNotEmpty()
  @Prop()
  twoPointFieldGoalPercentage: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop()
  freeThrows: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop()
  freeThrowAttempts: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsNotEmpty()
  @Prop()
  freeThrowPercentage: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop()
  offensiveRebounds: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop()
  defensiveRebounds: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop()
  totalRebounds: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop()
  assists: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop()
  steals: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop()
  blocks: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop()
  turnovers: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop()
  personalFouls: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Prop()
  points: number;
}
