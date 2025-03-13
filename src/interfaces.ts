// Define the structure of our data items
export interface DataItem {
  name: string;
  occupation: string;
  city: string;
  [key: string]: any; // Allow for additional properties
}

// Other interfaces can remain the same
export interface FilterCondition {
  field: string;
  operator: string;
  value: string;
}

export interface FilterGroup {
  logic: "and" | "or";
  filters: (FilterCondition | FilterGroup)[];
}