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

export interface FieldConfig {
  name: string;
  label: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
}

export interface OperatorConfig {
  name: string;
  label: string;
  logic: (field: string, value: string) => string;
}

export interface StylesConfig {
  root?: React.CSSProperties;
  buttonGroup?: React.CSSProperties;
  conditionRow?: React.CSSProperties;
  input?: React.CSSProperties;
  clearButton?: React.CSSProperties;
}

export interface AccessibilityLabels {
  addCondition: string;
  addGroup: string;
  clearFilters: string;
  removeFilter: string;
  operatorSelect?: string;
  valueInput?: string;
}

/**
 * Props for the InteractiveDataFilterBuilder
 */
export interface InteractiveDataFilterBuilderProps {
  fieldsConfig?: FieldConfig[];
  defaultOperators?: OperatorConfig[];
  operatorsByField?: { [key: string]: OperatorConfig[] };
  styles?: StylesConfig;
  accessibilityLabels?: AccessibilityLabels;
  onFilterChange?: (filter: FilterGroup | string) => void;
  outputFormat?: 'structured' | 'query';
}