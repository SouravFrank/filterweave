export interface DataItem {
  name: string;
  occupation: string;
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