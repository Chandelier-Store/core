import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ProductService } from 'src/products/product/product.service'

@Injectable()
export class CronService {
	constructor(private productService: ProductService) {}
	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
		timeZone: 'Asia/Dushanbe'
	})
	async handleProductOfTheDay() {
		const todayStr = new Date().toISOString().split('T')[0]
		const today = new Date(todayStr)
		await this.productService.pickNewProduct(today)
	}
}
