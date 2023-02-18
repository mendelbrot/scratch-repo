import { IsEnum, IsOptional, IsString } from 'class-validator'
import { Role } from 'src/auth/entities'

export class UserEditDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  password?: string

  @IsEnum(Role)
  @IsOptional()
  role?: Role
}
