import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UploadedFiles,
	UseInterceptors,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { Auth } from 'src/account/auth/decorators/auth.decorator'
import { ProductDto } from './dto/product.dto'
import { QueryDto } from './dto/query.dto'
import { ProductService } from './product.service'

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}
	@Get()
	@UsePipes(new ValidationPipe({ transform: true }))
	async getList(@Query() query: QueryDto) {
		return this.productService.getList(query)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(201)
	@Auth()
	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: 'image', maxCount: 1 },
			{ name: 'preview', maxCount: 1 }
		])
	)
	@Post()
	async create(
		@Body() dto: ProductDto,
		@UploadedFiles()
		files: { image?: Express.Multer.File[]; preview?: Express.Multer.File[] }
	) {
		const image = files.image?.[0]
		const preview = files.preview?.[0]
		return this.productService.create(dto, image, preview)
	}

	@Put(':id')
	@HttpCode(200)
	@Auth()
	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: 'image', maxCount: 1 },
			{ name: 'preview', maxCount: 1 }
		])
	)
	@UsePipes(new ValidationPipe())
	async update(
		@Param('id') id: string,
		@Body() dto: ProductDto,
		@UploadedFiles()
		files: { image?: Express.Multer.File[]; preview?: Express.Multer.File[] }
	) {
		const image = files.image?.[0]
		const preview = files.preview?.[0]
		return this.productService.update(id, dto, image, preview)
	}

	@Delete(':id')
	@HttpCode(204)
	@Auth()
	async delete(@Param('id') id: string) {
		return this.productService.delete(id)
	}

	@Get('week-products')
	async getWeekProducts() {
		return this.productService.getWeekProducts()
	}
}
