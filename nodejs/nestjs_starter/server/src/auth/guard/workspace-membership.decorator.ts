import { SetMetadata } from '@nestjs/common'

export const WorkspaceMembership = (accessLevel: string) =>
  SetMetadata('accessLevel', accessLevel)
