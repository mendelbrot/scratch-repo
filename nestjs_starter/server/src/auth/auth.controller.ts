import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { SigninDto } from './dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto)
  }
}
