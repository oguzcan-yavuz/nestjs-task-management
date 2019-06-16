import { Injectable, NotFoundException } from '@nestjs/common';
import * as uuid from 'uuid/v1';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDTO: GetTasksFilterDTO): Task[] {
    const tasks = this.getAllTasks();
    const { status, search } = filterDTO;

    // NOTE: can this be implemented in a more generic way?
    const filterParamFnMap = {
      status: task => task.status === status,
      search: task => task.title.includes(search) || task.description.includes(search),
    };

    // NOTE: this can be a util func
    const filterFnsToApply = Object.keys(filterDTO)
      .filter(param => filterDTO[param])
      .map(param => filterParamFnMap[param]);

    // NOTE: this can be a util func
    return filterFnsToApply
      .reduce((filteredTasks, filterFn) => filteredTasks.filter(filterFn), tasks);
  }

  getTaskById(id: string): Task {
    const foundTask = this.tasks.find(task => task.id === id);

    if (!foundTask) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return foundTask;
  }

  deleteTaskById(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  createTask(createTaskDTO: CreateTaskDTO): Task {
    const { title, description } = createTaskDTO;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(id: string, updateTaskStatusDTO: UpdateTaskStatusDTO): Task {
    const { status } = updateTaskStatusDTO;
    const task = this.getTaskById(id);
    task.status = status;

    return task;
  }
}
