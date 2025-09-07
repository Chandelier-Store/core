import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ProductService } from 'src/products/product/product.service'

@Injectable()
export class CronService {
	constructor(private productService: ProductService) {}
	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
		timeZone: 'Asia/Dushanbe'
	})
	async handleProductOfTheWeek() {
		const weekStart = new Date()
		weekStart.setHours(0, 0, 0, 0)
		weekStart.setDate(weekStart.getDate() - weekStart.getDay())
		await this.productService.pickNewWeekProducts([], 5, weekStart)
	}
}
