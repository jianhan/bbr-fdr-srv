import { Test, TestingModule } from '@nestjs/testing';
import { SeasonSummariesService } from './season-summaries.service';

describe('SeasonSummariesService', () => {
  let service: SeasonSummariesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeasonSummariesService],
    }).compile();

    service = module.get<SeasonSummariesService>(SeasonSummariesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
