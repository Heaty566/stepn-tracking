import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TrackingModule } from './tracking/tracking.module';

@Module({
    imports: [ScheduleModule.forRoot(), TrackingModule],
    providers: [],
})
export class AppModule {}
