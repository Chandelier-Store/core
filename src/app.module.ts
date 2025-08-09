import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { StorageModule } from './storage/storage.module'
import { FaqModule } from './faq/faq.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		StorageModule,
		FaqModule,
		CategoryModule,
		AuthModule,
		ProductModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
