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
  UseGuards,
} from '@nestjs/common'
import { GetUser } from 'src/auth/decorator'
import { JwtGuard } from 'src/auth/guard'
import { CreateTaskDto, EditTaskDto } from './dto'
import { TaskService } from './task.service'

@UseGuards(JwtGuard)
@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  getUserTasks(@GetUser('id') userId: number) {
    return this.taskService.getUserTasks(userId)
  }

  @Post()
  createTask(
    @GetUser('id') userId: number,
    @Body() dto: CreateTaskDto,
  ) {
    return this.taskService.createTask(userId, dto)
  }

  @Get(':id')
  getTaskById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.getTaskById(userId, taskId)
  }

  @Patch(':id')
  editTaskById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: EditTaskDto,
  ) {
    return this.taskService.editTaskById(userId, taskId, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTaskById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.deleteTaskById(userId, taskId)
  }
}
