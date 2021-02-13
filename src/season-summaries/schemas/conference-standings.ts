import { IsArray, ValidateNested } from 'class-validator';
import { Prop } from '@nestjs/mongoose';
import { StandingTeamStatus } from './standing-team-status';

export class ConferenceStandings {
  @IsArray()
  @ValidateNested()
  @Prop({ required: true, type: Array, of: StandingTeamStatus })
  easternConference: StandingTeamStatus[];

  @IsArray()
  @ValidateNested()
  @Prop({ required: true, type: Array, of: StandingTeamStatus })
  westernConference: StandingTeamStatus[];
}
