import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UserDto } from './dto/user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UsePipes(new ValidationPipe({ whitelist: true }))
	@HttpCode(200)
	@Auth()
	@Get('list')
	async getList() {
		return this.userService.getList()
	}

	@UsePipes(new ValidationPipe({ whitelist: true }))
	@HttpCode(200)
	@Auth()
	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body() data: UserDto,
		@CurrentUser() currentUser
	) {
		return this.userService.update(id, data, currentUser)
	}

	@UsePipes(new ValidationPipe({ whitelist: true }))
	@HttpCode(204)
	@Auth()
	@Delete(':id')
	async delete(@Param('id') id: string, @CurrentUser() currentUser) {
		return this.userService.delete(id, currentUser)
	}
}
