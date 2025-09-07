import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { StorageService } from 'src/storage/storage.service'
import { BannerController } from './banner.controller'
import { BannerService } from './banner.service'

@Module({
	controllers: [BannerController],
	providers: [BannerService, PrismaService, StorageService]
})
export class BannerModule {}
