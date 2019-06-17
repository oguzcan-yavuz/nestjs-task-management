import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const foundTask = await this.taskRepository.findOne(id);

    if (!foundTask) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return foundTask;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }
  // getTaskById(id: string): Task {
  //   const foundTask = this.tasks.find(task => task.id === id);
  //
  //   if (!foundTask) {
  //     throw new NotFoundException(`Task with ID "${id}" not found`);
  //   }
  //
  //   return foundTask;
  // }
  //
  async deleteTaskById(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(id: number, updateTaskStatusDto: UpdateTaskStatusDto): Promise<Task> {
    const { status } = updateTaskStatusDto;
    const task = await this.getTaskById(id);
    Object.assign(task, { status });
    await task.save();

    return task;
  }
}
