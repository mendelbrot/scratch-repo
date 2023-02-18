import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { Workspace } from '@prisma/client'
import { WorkspaceExtended } from './types'
import { PrismaService } from 'src/prisma/prisma.service'
import { WorkspaceCreateDto, WorkspaceEditDto } from './dto'
import { AccessLevel } from './entities'

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    dto: WorkspaceCreateDto,
  ): Promise<Workspace> {
    return await this.prisma.workspace.create({
      data: {
        ...dto,
        workspace_memberships: {
          create: {
            user_id: userId,
            access_level: AccessLevel.Full,
          },
        },
      },
    })
  }

  async getMySpaces(userId: number): Promise<Workspace[]> {
    return await this.prisma.workspace.findMany({
      where: {
        workspace_memberships: {
          some: {
            user_id: userId,
          },
        },
      },
    })
  }

  async getById(
    userId: number,
    workspaceId: number,
  ): Promise<WorkspaceExtended> {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        // workspace_memberships: {
        //   some: {
        //     user_id: userId,
        //   },
        // },
        id: workspaceId,
      },
      include: {
        workspace_memberships: true,
        notebooks: true,
      },
    })
    if (!workspace) {
      throw new NotFoundException()
    }
    return workspace
  }

  async editById(
    userId: number,
    workspaceId: number,
    dto: WorkspaceEditDto,
  ): Promise<WorkspaceExtended> {
    // check if this workspace exists and is one of the users workspaces
    // const workspace = await this.getById(userId, workspaceId)

    // check if the user has access level to edit
    // const membership = workspace.workspace_memberships.find(
    //   (item) => item.user_id === userId,
    // )
    // if (membership.access_level !== AccessLevel.Full) {
    //   throw new ForbiddenException()
    // }

    // edit the workspace
    const editedWorkspace = await this.prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: dto,
      include: {
        workspace_memberships: true,
        notebooks: true,
      },
    })

    return editedWorkspace
  }

  // async deleteById(userId: number, workspaceId: number) {
  //   // check if the user owns the workspace
  //   const workspace = await this.prisma.workspace.findFirst({
  //     where: {
  //       userId,
  //       id: workspaceId,
  //     },
  //   })
  //   if (!workspace) {
  //     throw new NotFoundException()
  //   }

  //   // delete the workspace
  //   await this.prisma.workspace.delete({
  //     where: {
  //       id: workspaceId,
  //     },
  //   })
  // }
}
