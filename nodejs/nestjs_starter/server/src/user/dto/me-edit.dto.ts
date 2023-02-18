import { IsOptional, IsString } from 'class-validator'

export class MeEditDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  password?: string
}
