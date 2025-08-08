import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { FaqDto } from './dto/faq.dto'
import { FaqService } from './faq.service'

@Controller('faq')
export class FaqController {
	constructor(private readonly faqService: FaqService) {}
	@Get()
	async getList() {
		return this.faqService.getList()
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(201)
	@Post()
	async create(@Body() dto: FaqDto) {
		return this.faqService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: FaqDto) {
		return this.faqService.update(id, dto)
	}

	@HttpCode(204)
	// @Auth()
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.faqService.delete(id)
	}
}
