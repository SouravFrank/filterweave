export interface Condition {
  field: string;
  operator: string;
  value: string;
}

export interface Group {
  logic: string;
  filters: Array<Condition | Group>;
}

export interface FilterConditionComponentProps {
  condition: Condition;
  path: number[];
  onUpdateCondition: (path: number[], updatedCondition: Condition) => void;
  onRemoveItem: (path: number[]) => void;
  fields: string[];
  operators: string[];
  operatorsByField?: { [key: string]: string[] };
}

export interface FilterGroupComponentProps {
  group: Group;
  path: number[];
  indentationLevel: number;
  onAddCondition: (path: number[]) => void;
  onAddGroup: (path: number[]) => void;
  onRemoveItem: (path: number[]) => void;
  onUpdateCondition: (path: number[], updatedCondition: Condition) => void;
  onUpdateLogic: (path: number[], newLogic: string) => void;
  fields: string[];
  operators: string[];
  operatorsByField?: { [key: string]: string[] };
}

export interface InteractiveDataFilterBuilderProps {
  fields: string[];
  onFilterChange?: (filter: Group) => void;
  operatorsByField?: { [key: string]: string[] };
}

export interface InteractiveDataFilterBuilderState {
  filter: Group;
}