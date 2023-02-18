import { UserCreateDto } from 'src/user/dto'
import { Role } from 'src/auth/entities'
import { firstUserDto } from 'test/constants'

export const describeUsers = (pactum) =>
  describe('users', () => {
    const secondUserDto: UserCreateDto = {
      name: 'deimos',
      password: 'pw555',
      role: Role.User,
    }

    const user3Dto: UserCreateDto = {
      name: 'triton',
      password: 'pwXYZ',
      role: Role.Admin,
    }

    const User1NewName = 'chiron'
    const User1NewPw = 'pwABC'

    describe('get me', () => {
      it('should throw if request without authorization header', () => {
        return pactum.spec().get('/users/me').expectStatus(401)
      })
    })

    describe('get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200)
          .expectJsonLike({
            name: firstUserDto.name,
            role: firstUserDto.role,
          })
      })
    })

    describe('edit me', () => {
      it('should edit my user name', () => {
        return pactum
          .spec()
          .put('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody({
            name: User1NewName,
          })
          .expectStatus(200)
          .expectJsonLike({
            name: User1NewName,
            role: firstUserDto.role,
          })
      })

      it('should not edit my role', () => {
        return pactum
          .spec()
          .put('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody({
            role: Role.User,
          })
          .expectStatus(200)
          .expectJsonLike({
            name: User1NewName,
            role: firstUserDto.role,
          })
      })

      it('should edit my password', () => {
        return pactum
          .spec()
          .put('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody({
            password: User1NewPw,
          })
          .expectStatus(200)
      })

      it('should throw if sign in with my old password', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            name: User1NewName,
            password: firstUserDto.password,
          })
          .expectStatus(401)
      })

      it('should sign in with my new password', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            name: User1NewName,
            password: User1NewPw,
          })
          .expectStatus(200)
          .stores('userAccessToken', 'access_token') // stores user access token
      })
    })

    describe('create user', () => {
      it('should create a standard user', () => {
        return pactum
          .spec()
          .post('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(secondUserDto)
          .expectStatus(201)
          .expectJsonLike({
            name: secondUserDto.name,
            role: secondUserDto.role,
          })
          .stores('user2Id', 'id') // stores the id of user 2
      })

      it('should create an admin user', () => {
        return pactum
          .spec()
          .post('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(user3Dto)
          .expectStatus(201)
          .expectJsonLike({
            name: user3Dto.name,
            role: user3Dto.role,
          })
          .stores('user3Id', 'id') // stores the id of user 3
      })

      it('should sign in as new user', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            name: secondUserDto.name,
            password: secondUserDto.password,
          })
          .expectStatus(200)
          .stores('user2AccessToken', 'access_token') // stores user access token
      })

      it('should throw if non-admin creates user', () => {
        return pactum
          .spec()
          .post('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(secondUserDto)
          .expectStatus(403)
      })
    })

    describe('delete me', () => {
      it('should delete current user', () => {
        return pactum
          .spec()
          .delete('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{user2AccessToken}',
          })
          .withBody(secondUserDto)
          .expectStatus(204)
      })

      it('should throw if make request as deleted user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{user2AccessToken}',
          })
          .expectStatus(401)
      })

      it('should throw if sign in as deleted user', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            name: secondUserDto.name,
            password: secondUserDto.password,
          })
          .expectStatus(401)
      })
    })
  })
