import { HttpModule, Module } from '@nestjs/common';
import { SeasonSummariesService } from './season-summaries.service';
import { CacheModule } from '../cache/cache.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SeasonSummary, SeasonSummarySchema } from './schemas/season-summary.schema';

@Module({
  imports: [HttpModule, CacheModule, ConfigModule, MongooseModule.forFeature([{ name: SeasonSummary.name, schema: SeasonSummarySchema }])],
  providers: [SeasonSummariesService],
})
export class SeasonSummariesModule {}
