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
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CategoryService } from './category.service'
import { CategoryDto } from './dto/category.dto'

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	async getList() {
		return this.categoryService.getList()
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(201)
	@Auth()
	@UseInterceptors(FileInterceptor('image'))
	@Post()
	async create(
		@Body() dto: CategoryDto,
		@UploadedFile() image: Express.Multer.File
	) {
		return this.categoryService.create(dto, image)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@UseInterceptors(FileInterceptor('image'))
	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body() dto: CategoryDto,
		@UploadedFile() image: Express.Multer.File
	) {
		return this.categoryService.update(id, dto, image)
	}

	@HttpCode(204)
	@Auth()
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.categoryService.delete(id)
	}
}
