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
	UploadedFile,
	UseInterceptors,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Auth } from 'src/auth/decorators/auth.decorator'
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
	@UseInterceptors(FileInterceptor('image'))
	@Post()
	async create(
		@Body() dto: ProductDto,
		@UploadedFile() image: Express.Multer.File
	) {
		return this.productService.create(dto, image)
	}

	@Put(':id')
  @HttpCode(200)
	@Auth()
	@UseInterceptors(FileInterceptor('image'))
	@UsePipes(new ValidationPipe())
	async update(
		@Param('id') id: string,
		@Body() dto: ProductDto,
		@UploadedFile() image: Express.Multer.File
	) {
		return this.productService.update(id, dto, image)
	}

  @Delete(':id')
  @HttpCode(204)
  @Auth()
  async delete(@Param('id') id: string) {
    return this.productService.delete(id)
  }
}
