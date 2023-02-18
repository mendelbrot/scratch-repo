import { firstUserDto } from '../constants'

export const describeAuth = (pactum) =>
  describe('auth', () => {
    describe('signin', () => {
      it('should throw if no name is provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: firstUserDto.password })
          .expectStatus(400)
      })

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ name: firstUserDto.name })
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
          .withBody({
            name: firstUserDto.name,
            password: firstUserDto.password,
          })
          .expectStatus(200)
          .stores('userAccessToken', 'access_token') // stores user access token
      })

      it('should throw if sign in nonexisting user', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            name: 'notaname',
            password: firstUserDto.password,
          })
          .expectStatus(401)
      })

      it('should throw if sign in wrong password', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            name: firstUserDto.name,
            password: 'notapw',
          })
          .expectStatus(401)
      })
    })

    describe('signin', () => {
      it('should throw if no name is provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: firstUserDto.password })
          .expectStatus(400)
      })
    })
  })
