import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { StorageService } from 'src/storage/storage.service'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { CronService } from 'src/cron/cron.service'

@Module({
	controllers: [ProductController],
	providers: [ProductService, PrismaService, StorageService, CronService],
	exports: [ProductService]
})
export class ProductModule {}
