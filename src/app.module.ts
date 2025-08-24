import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { FaqModule } from './faq/faq.module'
import { ProductModule } from './product/product.module'
import { StorageModule } from './storage/storage.module'
import { UserModule } from './user/user.module'
import { CronModule } from './cron/cron.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		ScheduleModule.forRoot(),
		StorageModule,
		FaqModule,
		CategoryModule,
		AuthModule,
		ProductModule,
		UserModule,
		CronModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
