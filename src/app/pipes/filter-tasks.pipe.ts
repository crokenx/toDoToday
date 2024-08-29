import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '@app/core';

@Pipe({
  name: 'filterTasks',
  standalone: true
})
export class FilterTasksPipe implements PipeTransform {

  transform(tasks: Task[], categories: string[]): Task[] {
    console.log("tasks ", tasks)
    console.log("categories ", categories)
    if (!tasks.length) return [];
    if (!categories.length) return tasks;


    tasks = tasks.filter(task => {
      const taskCategories = task.categories;
      if (!taskCategories) return;
      const inside = taskCategories.some(category => categories.includes(category));
      if (inside) return task;
      return;
    });

    return tasks;
  }

}
