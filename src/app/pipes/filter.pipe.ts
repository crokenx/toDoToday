import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(categories: string[], searchTerm: string): string[] {
    if (!categories.length) return [];
    if (!searchTerm.length) return categories;

    searchTerm = searchTerm.toLowerCase();

    console.log("filter categories ", categories)

    return categories.filter(category =>
      category.toLowerCase().includes(searchTerm)
    );
  }

}
