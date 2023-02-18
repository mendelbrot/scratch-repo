import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator'

export class WorkspaceCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string
}
