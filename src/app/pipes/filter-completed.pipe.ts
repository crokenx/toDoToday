import { Task, TaskStatus } from '@core/task';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCompleted',
  standalone: true
})
export class FilterCompletedPipe implements PipeTransform {

  transform(tasks: Task[], nowShowing: string): Task[] {
    if (!tasks.length) return [];
    console.log(nowShowing)
    const status = nowShowing === 'todo' ? TaskStatus.PENDING : TaskStatus.COMPLETED;

    tasks = tasks.filter(task => task.status === status);

    return tasks;
  }

}
