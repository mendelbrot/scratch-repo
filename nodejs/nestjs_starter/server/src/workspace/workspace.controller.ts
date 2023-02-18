import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { GetUser } from 'src/auth/decorator'
import { JwtGuard } from 'src/auth/guard'
import { WorkspaceCreateDto, WorkspaceEditDto } from './dto'
import { WorkspaceService } from './workspace.service'
import {
  WorkspaceMembershipGuard,
  WorkspaceMembership,
} from 'src/auth/guard'
import { AccessLevel } from './entities'

@UseGuards(JwtGuard, WorkspaceMembershipGuard)
@Controller('workspaces')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Post()
  create(
    @GetUser('id') userId: number,
    @Body() dto: WorkspaceCreateDto,
  ) {
    return this.workspaceService.create(userId, dto)
  }

  // @Put('memberships')
  // workspaceMembershipUpsert(
  //   @GetUser('id') userId: number,
  //   @Body() dto: WorkspaceEditDto,
  // ) {
  //   return this.workspaceService.workspaceMembershipUpsert(userId, dto)
  // }

  @Get('my-spaces')
  getMySpaces(@GetUser('id') userId: number) {
    return this.workspaceService.getMySpaces(userId)
  }

  @Get(':id')
  @WorkspaceMembership(AccessLevel.Read)
  getById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) workspaceId: number,
  ) {
    return this.workspaceService.getById(userId, workspaceId)
  }

  @Put(':id')
  @WorkspaceMembership(AccessLevel.Full)
  editById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) workspaceId: number,
    @Body() dto: WorkspaceEditDto,
  ) {
    return this.workspaceService.editById(userId, workspaceId, dto)
  }

  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // deleteById(
  //   @GetUser('id') userId: number,
  //   @Param('id', ParseIntPipe) workspaceId: number,
  // ) {
  //   return this.workspaceService.deleteById(userId, workspaceId)
  // }
}
