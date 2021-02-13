import { Link } from '../../models/Link';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, Max, Min, ValidateNested } from 'class-validator';
import { Prop } from '@nestjs/mongoose';

export class StandingTeamStatus {
  @IsNotEmpty()
  @ValidateNested()
  @Prop()
  teamName: Link;

  @IsNotEmpty()
  @Prop()
  isPlayoffTeam: boolean;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Prop()
  wins: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Prop()
  losses: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1)
  @Prop()
  winLossPercentage: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @Prop()
  gamesBehind?: number;

  @IsNotEmpty()
  @Prop()
  pointsPerGame: number;

  @IsNotEmpty()
  @Prop()
  opponentPointsPerGame: number;

  @IsNotEmpty()
  @Prop()
  simpleRatingSystem: number;
}
