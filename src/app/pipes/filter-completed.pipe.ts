import { Task, TaskStatus } from '@core/task';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCompleted',
  standalone: true
})
export class FilterCompletedPipe implements PipeTransform {

  transform(tasks: Task[]): Task[] {
    if (!tasks.length) return [];

    tasks = tasks.filter(task => task.status !== TaskStatus.COMPLETED);

    return tasks;
  }

}
