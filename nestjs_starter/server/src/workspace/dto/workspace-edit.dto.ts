import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator'

export class WorkspaceEditDto {
  @IsString()
  @IsOptional()
  name?: string
}
