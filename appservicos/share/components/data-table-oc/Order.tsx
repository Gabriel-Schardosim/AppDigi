import {Column} from '../../models/objects/Column';

export class Order {
  sortDirection: SortDirection;
  column: Column;

  constructor(sortDirection: SortDirection, column: Column) {
    this.sortDirection = sortDirection;
    this.column = column;
  }

  getFilter() {
    return this.column.path + ' ' + this.sortDirection;
  }
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

