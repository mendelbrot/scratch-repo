import { WorkspaceCreateDto } from 'src/workspace/dto'

export const describeWorkspaces = (pactum) =>
  describe('workspaces', () => {
    const firstWorkspaceDto: WorkspaceCreateDto = {
      name: 'homespace',
    }

    describe('get empty list of workspaces', () => {
      it('should get empty list of workspaces', () => {
        return pactum
          .spec()
          .get('/workspaces/my-spaces')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(firstWorkspaceDto)
          .expectStatus(200)
          .expectBody([])
      })
    })

    describe('create a workspace', () => {
      it('should create a workspace', () => {
        return pactum
          .spec()
          .post('/workspaces')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(firstWorkspaceDto)
          .expectStatus(201)
          .stores('workspaceId', 'id') // stores workspace id
      })
    })

    describe('get workspaces', () => {
      it('should get workspaces this user belongs with', () => {
        return pactum
          .spec()
          .get('/workspaces/my-spaces')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(firstWorkspaceDto)
          .expectStatus(200)
          .expectJsonLength(1)
      })
    })

    describe('get workspace by id', () => {
      it('should throw if workspace id does not exist', () => {
        return pactum
          .spec()
          .get('/workspaces/555')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(404)
      })

      it('should get workspace by id', () => {
        return pactum
          .spec()
          .get('/workspaces/{id}')
          .withPathParams('id', '$S{workspaceId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200)
          .inspect()
          .expectBodyContains('$S{workspaceId}')
      })
    })

    // const editDto: EditTaskDto = {
    //   title: 'plithlop2',
    //   description: 'droup traknis dort latru2',
    // }

    // describe('edit workspace by id', () => {
    //   it('should edit workspace by id', () => {
    //     return pactum
    //       .spec()
    //       .patch('/workspaces/{id}')
    //       .withPathParams('id', '$S{workspaceId}')
    //       .withHeaders({
    //         Authorization: 'Bearer $S{userAccessToken}',
    //       })
    //       .withBody(editDto)
    //       .expectStatus(200)
    //       .expectBodyContains(editDto.title)
    //       .expectBodyContains(editDto.description)
    //   })
    // })

    // describe('edit workspace by id', () => {
    //   it('should throw if workspace id does not exist', () => {
    //     return pactum
    //       .spec()
    //       .patch('/workspaces/123456789')
    //       .withHeaders({
    //         Authorization: 'Bearer $S{userAccessToken}',
    //       })
    //       .withBody(firstWorkspaceDto)
    //       .expectStatus(404)
    //   })
    // })

    // describe('delete workspace by id', () => {
    //   it('should get workspace by id', () => {
    //     return pactum
    //       .spec()
    //       .delete('/workspaces/{id}')
    //       .withPathParams('id', '$S{workspaceId}')
    //       .withHeaders({
    //         Authorization: 'Bearer $S{userAccessToken}',
    //       })
    //       .expectStatus(204)
    //   })

    //   it('should throw if workspace was already deleted', () => {
    //     return pactum
    //       .spec()
    //       .delete('/workspaces/{id}')
    //       .withPathParams('id', '$S{workspaceId}')
    //       .withHeaders({
    //         Authorization: 'Bearer $S{userAccessToken}',
    //       })
    //       .expectStatus(404)
    //   })
    // })
  })
