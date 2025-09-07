import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { BannerModule } from './banner/banner.module'
import { FaqModule } from './faq/faq.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		ScheduleModule.forRoot(),
		FaqModule,
		BannerModule
	]
})
export class ContentModule {}
