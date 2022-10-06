import { IsString, IsNotEmpty, IsEnum } from 'class-validator'
import { Role } from 'src/auth/entities'

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsEnum(Role)
  role: Role
}
