import { UserCreateDto } from 'src/user/dto'
import { Role } from 'src/auth/entities'

export const firstUserDto: UserCreateDto = {
  name: 'uno1',
  password: 'testpw',
  role: Role.Admin,
}
