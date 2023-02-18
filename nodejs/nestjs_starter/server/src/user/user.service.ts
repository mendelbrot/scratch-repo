import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { UserCreateDto, UserEditDto } from './dto'
import * as argon from 'argon2'
import { UserCreateDbIn, UserEditDbIn, MeEditDbIn } from './entities'
import { MeEditDto } from './dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editMe(userId: number, dto: MeEditDto) {
    const newData: MeEditDbIn = {}
    if (Object.hasOwn(dto, 'name')) {
      newData.name = dto.name
    }
    if (Object.hasOwn(dto, 'password')) {
      newData.hash = await argon.hash(dto.password)
    }

    let editedUser: User
    try {
      // edit the user in the db
      editedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: newData,
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // handle username already taken
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken')
        }
      }
      // handle any other error
      console.log(error)
      throw new InternalServerErrorException('User not edited')
    }

    delete editedUser.hash

    return editedUser
  }

  async get() {
    return this.prisma.user.findMany()
  }

  async create(dto: UserCreateDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password)

    const newData: UserCreateDbIn = {
      name: dto.name,
      hash,
      role: dto.role,
    }

    let user: User
    try {
      // save the new user in the db
      user = await this.prisma.user.create({
        data: newData,
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken')
        }
      }
      console.log(error)
      throw new InternalServerErrorException('User not created')
    }

    delete user.hash

    return user
  }

  async edit(userId: number, dto: UserEditDto): Promise<User> {
    const newData: UserEditDbIn = {}
    if (Object.hasOwn(dto, 'name')) {
      newData.name = dto.name
    }
    if (Object.hasOwn(dto, 'password')) {
      newData.hash = await argon.hash(dto.password)
    }
    if (Object.hasOwn(dto, 'role')) {
      newData.role = dto.role
    }

    let user: User
    try {
      // save the new user in the db
      user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: newData,
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken')
        }
      }
      console.log(error)
      throw new InternalServerErrorException('User not edited')
    }

    delete user.hash

    return user
  }

  async delete(userId) {
    console.log({ userId: userId })
    try {
      const res = await this.prisma.user.delete({
        where: {
          id: userId,
        },
      })
      console.log(res)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error.message)
    }
  }
}
