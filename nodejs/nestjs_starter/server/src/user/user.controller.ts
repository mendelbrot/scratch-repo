import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  UseGuards,
  ParseIntPipe,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { GetUser } from 'src/auth/decorator'
import { JwtGuard, RolesGuard, Roles } from 'src/auth/guard'
import { UserCreateDto, UserEditDto } from './dto'
import { UserService } from './user.service'
import { Role } from '../auth/entities'
import { MeEditDto } from './dto'

@UseGuards(JwtGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user
  }

  @Put('me')
  editMe(@GetUser('id') userId: number, @Body() dto: MeEditDto) {
    return this.userService.editMe(userId, dto)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('me')
  deleteMe(@GetUser('id') userId: number) {
    this.userService.delete(userId)
  }

  @Get()
  @Roles(Role.Admin)
  get() {
    return this.userService.get()
  }

  @Post()
  @Roles(Role.Admin)
  create(@Body() dto: UserCreateDto) {
    return this.userService.create(dto)
  }

  @Put(':id')
  @Roles(Role.Admin)
  edit(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: UserEditDto,
  ) {
    return this.userService.edit(userId, dto)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Roles(Role.Admin)
  delete(@Param('id', ParseIntPipe) userId: number) {
    this.userService.delete(userId)
  }
}
