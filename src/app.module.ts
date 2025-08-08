import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { StorageModule } from './storage/storage.module'
import { FaqModule } from './faq/faq.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		StorageModule,
		FaqModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
