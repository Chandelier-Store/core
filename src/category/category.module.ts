import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { StorageService } from 'src/storage/storage.service'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'

@Module({
	controllers: [CategoryController],
	providers: [CategoryService, PrismaService, StorageService]
})
export class CategoryModule {}
