import { Role } from 'src/auth/entities'

export class UserEditDbIn {
  name?: string
  hash?: string
  role?: Role
}
