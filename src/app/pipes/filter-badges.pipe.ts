import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBadges',
  standalone: true
})
export class FilterBadgesPipe implements PipeTransform {

  transform(categories: string[]): string[] {
    if (!categories) return [];
    if (!categories.length) return [];

    if (categories.length > 2) {
      const length = categories.length;
      const badges = categories.slice(0, 1)
      badges.push('+' + (length - 1));
      return badges;
    }

    return categories;
  }

}
