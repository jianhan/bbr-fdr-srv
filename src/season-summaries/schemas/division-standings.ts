import { Prop } from '@nestjs/mongoose';
import { IsArray, ValidateNested } from 'class-validator';
import { StandingTeamStatus } from './standing-team-status';

export class DivisionStandings {
  @IsArray()
  @ValidateNested()
  @Prop({ required: true, type: Array, of: StandingTeamStatus })
  easternConference: StandingTeamStatus[];

  @IsArray()
  @ValidateNested()
  @Prop({ required: true, type: Array, of: StandingTeamStatus })
  westernConference: StandingTeamStatus[];
}
