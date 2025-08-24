import { Module } from '@nestjs/common'
import { ProductModule } from 'src/product/product.module'
import { CronService } from './cron.service'

@Module({
	imports: [ProductModule],
	providers: [CronService]
})
export class CronModule {}
