import { TaskStatus } from '../task.model';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class GetTasksFilterDTO {
  @IsOptional()
  @IsIn(Object.keys(TaskStatus))
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
