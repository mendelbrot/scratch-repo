import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PrismaService } from 'src/prisma/prisma.service'
import { AccessLevel } from 'src/workspace/entities'

@Injectable()
export class WorkspaceMembershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAccessLevel = this.reflector.get<string>(
      'accessLevel',
      context.getHandler(),
    )

    if (!requiredAccessLevel) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    console.log(request.route.path)
    const userId = request.user.id
    const workspaceId = parseInt(request.params.id)

    const workspaceMembership =
      await this.prisma.workspaceMembership.findFirst({
        where: {
          workspace_id: workspaceId,
          user_id: userId,
        },
      })

    // if they have no membership to the workspace then the resource they are trying to access is "not found"
    if (!workspaceMembership) {
      throw new NotFoundException()
    }

    const usersAccessLevel = workspaceMembership.access_level

    // authorize the user if they have the required access level
    switch (usersAccessLevel) {
      case AccessLevel.Read:
        if (requiredAccessLevel === AccessLevel.Read) {
          return true
        }
      case AccessLevel.Full:
        if (requiredAccessLevel === AccessLevel.Full) {
          return true
        }
        if (requiredAccessLevel === AccessLevel.Read) {
          return true
        }
    }

    // otherwise throw an exception
    throw new ForbiddenException()
  }
}
