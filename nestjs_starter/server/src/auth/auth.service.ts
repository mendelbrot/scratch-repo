import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { SigninDto } from './dto'
import * as argon from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signin(dto: SigninDto) {
    // find the user by name
    const user = await this.prisma.user.findUnique({
      where: {
        name: dto.name,
      },
    })

    // if users doesnt exist throw exeption
    if (!user) {
      throw new UnauthorizedException('Credentials incorrect')
    }

    // compare passwords
    const pwMatches = await argon.verify(user.hash, dto.password)

    // if password doesnt exist throw exception
    if (!pwMatches) {
      throw new UnauthorizedException('Credentials incorrect')
    }

    // return the jwt
    return await this.signToken(user.id, user.name)
  }

  async signToken(
    userId: number,
    name: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      name,
    }

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('JWT_EXPIRY_TIME'),
      secret: this.config.get('JWT_SECRET'),
    })

    return {
      access_token,
    }
  }
}
