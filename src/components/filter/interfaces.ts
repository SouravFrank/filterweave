/**
 * Type definition for a filter condition
 */
export interface FilterCondition {
  field: string;
  operator: string;
  value: string;
}

/**
 * Type definition for a filter group
 */
export interface FilterGroup {
  logic: 'and' | 'or';
  filters: (FilterCondition | FilterGroup)[];
}

/**
 * Props for the FilterConditionComponent
 */
export interface FilterConditionComponentProps {
  condition: FilterCondition;
  path: number[];
  onUpdateCondition: (path: number[], condition: FilterCondition) => void;
  onRemoveItem: (path: number[]) => void;
  fields: string[];
  operators: string[];
  operatorsByField?: { [key: string]: string[] };
}

/**
 * Props for the FilterGroupComponent
 */
export interface FilterGroupComponentProps {
  group: FilterGroup;
  path: number[];
  indentationLevel: number;
  onAddCondition: (path: number[]) => void;
  onAddGroup: (path: number[]) => void;
  onRemoveItem: (path: number[]) => void;
  onUpdateCondition: (path: number[], condition: FilterCondition) => void;
  onUpdateLogic: (path: number[], logic: string) => void;
  fields: string[];
  operators: string[];
  operatorsByField?: { [key: string]: string[] };
}

/**
 * Props for the InteractiveDataFilterBuilder
 */
export interface InteractiveDataFilterBuilderProps {
  fields: string[];
  onFilterChange?: (filter: FilterGroup) => void;
  operatorsByField?: { [key: string]: string[] };
}