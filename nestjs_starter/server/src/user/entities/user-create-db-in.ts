import { Role } from 'src/auth/entities'

export class UserCreateDbIn {
  name: string
  hash: string
  role: Role
}
