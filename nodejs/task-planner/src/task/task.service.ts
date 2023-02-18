import { Injectable, NotFoundException } from '@nestjs/common'
import { Task } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateTaskDto, EditTaskDto } from './dto'

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  getUserTasks(userId: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        userId,
      },
    })
  }

  createTask(userId: number, dto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        ...dto,
        userId,
      },
    })
  }

  async getTaskById(userId: number, taskId: number): Promise<Task> {
    const task = await this.prisma.task.findFirst({
      where: {
        userId,
        id: taskId,
      },
    })
    if (!task) {
      throw new NotFoundException()
    }
    return task
  }

  async editTaskById(
    userId: number,
    taskId: number,
    dto: EditTaskDto,
  ): Promise<Task> {
    // check if the user owns the task
    const task = await this.prisma.task.findFirst({
      where: {
        userId,
        id: taskId,
      },
    })
    if (!task) {
      throw new NotFoundException()
    }

    // edit the task
    const editedTask = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: dto,
    })

    return editedTask
  }

  async deleteTaskById(userId: number, taskId: number) {
    // check if the user owns the task
    const task = await this.prisma.task.findFirst({
      where: {
        userId,
        id: taskId,
      },
    })
    if (!task) {
      throw new NotFoundException()
    }

    // delete the task
    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    })
  }
}
