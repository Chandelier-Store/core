import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UploadedFile,
	UseInterceptors,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Auth } from 'src/account/auth/decorators/auth.decorator'
import { BannerService } from './banner.service'
import { BannerDto } from './dto/banner.dto'

@Controller('banner')
export class BannerController {
	constructor(private readonly bannerService: BannerService) {}
	@Get()
	async getList() {
		return this.bannerService.getList()
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(201)
	@Auth()
	@UseInterceptors(FileInterceptor('image'))
	@Post()
	async create(
		@Body() dto: BannerDto,
		@UploadedFile() image: Express.Multer.File
	) {
		return this.bannerService.create(dto, image)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@UseInterceptors(FileInterceptor('image'))
	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body() dto: BannerDto,
		@UploadedFile() image: Express.Multer.File
	) {
		return this.bannerService.update(id, dto, image)
	}

	@HttpCode(204)
	@Auth()
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.bannerService.delete(id)
	}
}
