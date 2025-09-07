import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { ProductModule } from './product/product.module'
import { CategoryModule } from './category/category.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		ScheduleModule.forRoot(),
		ProductModule,
		CategoryModule
	]
})
export class ProductsModule {}
