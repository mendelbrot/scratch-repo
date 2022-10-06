import { IsEnum, IsNumber, IsString } from 'class-validator'
import { AccessLevel } from '../entities'

export class WorkspaceMembershipUpsertDto {
  @IsNumber()
  workspace_id: number

  @IsNumber()
  user_id: number

  @IsEnum(AccessLevel)
  access_level: AccessLevel
}
