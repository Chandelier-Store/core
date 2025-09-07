import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AccountModule } from './account/account.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ContentModule } from './content/content.module'
import { CronModule } from './cron/cron.module'
import { ProductsModule } from './products/products.module'
import { StorageModule } from './storage/storage.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		ScheduleModule.forRoot(),
		StorageModule,
		CronModule,
		AccountModule,
		ContentModule,
		ProductsModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
