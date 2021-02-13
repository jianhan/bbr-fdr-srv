import { Prop } from '@nestjs/mongoose';
import { IsArray, ValidateNested } from 'class-validator';
import { StandingTeamStatus } from './standing-team-status';
import { DivisionName } from '../types';

export class DivisionStandings {
  @IsArray()
  @ValidateNested()
  @Prop({ required: true, type: Array, of: StandingTeamStatus })
  easternConference: { [key in DivisionName]: StandingTeamStatus[] };

  @IsArray()
  @ValidateNested()
  @Prop({ required: true, type: Array, of: StandingTeamStatus })
  westernConference: { [key in DivisionName]: StandingTeamStatus[] };
}
