export interface DataItem {
  name: string;
  age: number;
  city: string;
}

export interface FilterCondition {
  field: string;
  operator: string;
  value: string;
}

export interface FilterGroup {
  logic: "and" | "or";
  filters: (FilterCondition | FilterGroup)[];
}