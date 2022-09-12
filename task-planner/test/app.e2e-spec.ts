import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as pactum from 'pactum'
import { AppModule } from './../src/app.module'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto } from 'src/auth/dto'
import { EditUserDto } from 'src/user/dto'
import { CreateTaskDto, EditTaskDto } from 'src/task/dto'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

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
    await prisma.cleanDb()

    pactum.request.setBaseUrl('http://localhost:5000')

    await app.listen(5000)
  })

  afterAll(async () => {
    app.close()
  })

  describe('auth', () => {
    const dto: AuthDto = {
      email: 'me@home.com',
      password: '123',
    }

    describe('signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400)
      })

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400)
      })

      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400)
      })

      it('should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
      })
    })

    describe('signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400)
      })

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400)
      })

      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400)
      })
      it('should sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token') // stores user access token
      })

      it('should throw if sign in nonexisting user', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: 'not.signed.up@home.com',
            password: 'wrongpw',
          })
          .expectStatus(403)
      })

      it('should throw if sign in wrong password', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
            password: 'wrongpw',
          })
          .expectStatus(403)
      })
    })
  })

  describe('user', () => {
    const dto: EditUserDto = {
      email: 'meNew@home.com',
      firstName: 'Blop',
      lastName: 'Drat',
    }

    describe('get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
      })
    })

    describe('edit user', () => {
      it('should edit user', () => {
        return pactum
          .spec()
          .patch('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email)
      })
    })
  })

  describe('task', () => {
    const dto: CreateTaskDto = {
      title: 'plithlop',
      description: 'droup traknis dort latru',
    }

    describe('get empty tasks', () => {
      it('should get tasks', () => {
        return pactum
          .spec()
          .get('/tasks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBody([])
      })
    })

    describe('create task', () => {
      it('should create task', () => {
        return pactum
          .spec()
          .post('/tasks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('taskId', 'id') // stores task id
      })
    })

    describe('get tasks', () => {
      it('should get tasks', () => {
        return pactum
          .spec()
          .get('/tasks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectJsonLength(1)
      })
    })

    describe('get task by id', () => {
      it('should throw if task id does not exist', () => {
        return pactum
          .spec()
          .get('/tasks/456456654')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(404)
      })

      it('should get task by id', () => {
        return pactum
          .spec()
          .get('/tasks/{id}')
          .withPathParams('id', '$S{taskId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .inspect()
          .expectBodyContains('$S{taskId}')
      })
    })

    const editDto: EditTaskDto = {
      title: 'plithlop2',
      description: 'droup traknis dort latru2',
    }

    describe('edit task by id', () => {
      it('should edit task by id', () => {
        return pactum
          .spec()
          .patch('/tasks/{id}')
          .withPathParams('id', '$S{taskId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(editDto)
          .expectStatus(200)
          .expectBodyContains(editDto.title)
          .expectBodyContains(editDto.description)
      })
    })

    describe('edit task by id', () => {
      it('should throw if task id does not exist', () => {
        return pactum
          .spec()
          .patch('/tasks/123456789')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(404)
      })
    })

    describe('delete task by id', () => {
      it('should get task by id', () => {
        return pactum
          .spec()
          .delete('/tasks/{id}')
          .withPathParams('id', '$S{taskId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204)
      })

      it('should throw if task was already deleted', () => {
        return pactum
          .spec()
          .delete('/tasks/{id}')
          .withPathParams('id', '$S{taskId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(404)
      })
    })
  })
})
