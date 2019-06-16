import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  private isStatusValid(status: any) {
    return Object.keys(TaskStatus).includes(status);
  }

  transform(value: any) {
    if (!this.isStatusValid(value.status.toUpperCase())) {
      throw new BadRequestException(`"${value.status}" is an invalid status`);
    }

    return value;
  }
}
