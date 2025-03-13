import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { FilterGroup, DataItem } from '../interfaces';
import { dummyData } from '../data/dummyData';

export class DataService {
  private applyFilter(data: DataItem[], filter: FilterGroup | null): DataItem[] {
    if (!filter || filter.filters.length === 0) return data;

    const { logic, filters } = filter;

    const filterFunctions = filters.map(f => {
      if ("field" in f) {
        const condition = f;
        return (item: DataItem): boolean => {
          const value = item[condition.field as keyof DataItem];
          let filterValue: string | number = condition.value;
          
          if (condition.field === "age") {
            filterValue = Number(condition.value);
            if (isNaN(filterValue)) return false;
          }

          switch (condition.operator) {
            case "eq": return value === filterValue;
            case "neq": return value !== filterValue;
            case "contains": return typeof value === "string" && value.toLowerCase().includes(String(filterValue).toLowerCase());
            case "startswith": return typeof value === "string" && value.toLowerCase().startsWith(String(filterValue).toLowerCase());
            case "endswith": return typeof value === "string" && value.toLowerCase().endsWith(String(filterValue).toLowerCase());
            case "gt": return typeof value === "number" && value > (filterValue as number);
            case "lt": return typeof value === "number" && value < (filterValue as number);
            case "gte": return typeof value === "number" && value >= (filterValue as number);
            case "lte": return typeof value === "number" && value <= (filterValue as number);
            default: return true;
          }
        };
      }
      return (item: DataItem) => this.applyFilter([item], f as FilterGroup).length > 0;
    });

    return data.filter(item =>
      logic === "and"
        ? filterFunctions.every(fn => fn(item))
        : filterFunctions.some(fn => fn(item))
    );
  }

  getFilteredAndSortedData(filter: FilterGroup | null, sort: SortDescriptor[]): DataItem[] {
    let data = this.applyFilter(dummyData, filter);
    return orderBy(data, sort);
  }
}