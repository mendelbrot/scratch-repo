import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as pactum from 'pactum'
import { AppModule } from './../src/app.module'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'
import {
  describeAuth,
  describeUsers,
  describeWorkspaces,
} from './chapters'
import { firstUserDto } from './constants'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userService: UserService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule(
      {
        imports: [AppModule],
      },
    ).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    await app.init()

    prisma = app.get(PrismaService)

    try {
      await prisma.cleanDb()
    } catch (error) {}

    userService = app.get(UserService)
    await userService.create(firstUserDto)

    pactum.request.setBaseUrl('http://localhost:5000')

    await app.listen(5000)
  })

  afterAll(async () => {
    app.close()
  })

  // these are the e2e tests.  see the ./chapters folder
  describeAuth(pactum)
  describeUsers(pactum)
  describeWorkspaces(pactum)
})
