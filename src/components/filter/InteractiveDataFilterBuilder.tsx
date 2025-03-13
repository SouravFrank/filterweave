import React, { useState } from "react";
import { Button } from "@progress/kendo-react-buttons";
import FilterGroupComponent from "./FilterGroupComponent";
import {
  addItemToPath,
  removeItemFromPath,
  updateConditionAtPath,
  updateLogicAtPath,
} from "./filterUtils";
import {
  InteractiveDataFilterBuilderProps,
  FilterGroup,
  FilterCondition,
  OperatorConfig,
} from "./interfaces";

/**
 * Interactive Data Filter Builder component with full configurability
 */
const InteractiveDataFilterBuilder: React.FC<InteractiveDataFilterBuilderProps> = ({
  fieldsConfig = [],
  defaultOperators = [
    { name: "eq", label: "Equals", logic: (field: string, value: string) => `${field} == ${value}` },
    { name: "contains", label: "Contains", logic: (field: string, value: string) => `contains(${field}, ${value})` },
    { name: "gt", label: "Greater Than", logic: (field: string, value: string) => `${field} > ${value}` },
    { name: "lt", label: "Less Than", logic: (field: string, value: string) => `${field} < ${value}` },
  ],
  operatorsByField = {},
  styles = {
    buttonGroup: { gap: "8px", marginTop: "16px" },
    root: { padding: "16px", borderRadius: "8px" },
    conditionRow: { gap: "8px", marginBottom: "8px" },
    input: { width: "200px" },
    clearButton: {}, // Added default for clearButton
  },
  accessibilityLabels = {
    addCondition: "Add new filter condition",
    addGroup: "Add new filter group",
    clearFilters: "Clear all filters",
    removeFilter: "Remove filter",
  },
  onFilterChange,
  outputFormat = "structured",
}) => {
  const [filter, setFilter] = useState<FilterGroup>({
    logic: "and",
    filters: [],
  });

  const getOperatorsForField = (fieldName: string): OperatorConfig[] => {
    return operatorsByField[fieldName] || defaultOperators;
  };

  const handleAddCondition = (path: number[]) => {
    const selectedField = fieldsConfig[0]?.name || "";
    const operators = getOperatorsForField(selectedField);
    const newCondition: FilterCondition = {
      field: selectedField,
      operator: operators[0]?.name || "eq",
      value: "",
    };
    const newFilter = addItemToPath(filter, path, newCondition);
    setFilter(newFilter);
    handleFilterOutput(newFilter);
  };

  const convertToQueryFormat = (filterGroup: FilterGroup): string => {
    // Recursive function to convert structured filter to query string
    const processFilter = (group: FilterGroup): string => {
      const conditions = group.filters.map((item) => {
        if ("field" in item) {
          const condition = item as FilterCondition;
          const operator = defaultOperators.find(op => op.name === condition.operator) ||
            Object.values(operatorsByField).flat().find(op => op.name === condition.operator);
          return operator ? operator.logic(condition.field, condition.value) : `${condition.field} ${condition.operator} ${condition.value}`;
        }
        return `(${processFilter(item as FilterGroup)})`;
      });
      return conditions.join(` ${group.logic} `);
    };
    return processFilter(filterGroup);
  };

  const handleFilterOutput = (newFilter: FilterGroup) => {
    if (onFilterChange) {
      if (outputFormat === "structured") {
        onFilterChange(newFilter);
      } else {
        onFilterChange(convertToQueryFormat(newFilter));
      }
    }
  };

  const handleAddGroup = (path: number[]) => {
    const newGroup: FilterGroup = { logic: "and", filters: [] };
    const newFilter = addItemToPath(filter, path, newGroup);
    setFilter(newFilter);
    handleFilterOutput(newFilter);
  };

  const handleRemoveItem = (path: number[]) => {
    const newFilter = removeItemFromPath(filter, path);
    setFilter(newFilter);
    handleFilterOutput(newFilter);
  };

  const handleUpdateCondition = (path: number[], updatedCondition: FilterCondition) => {
    const newFilter = updateConditionAtPath(filter, path, updatedCondition);
    setFilter(newFilter);
    handleFilterOutput(newFilter);
  };

  const handleUpdateLogic = (path: number[], newLogic: string) => {
    const newFilter = updateLogicAtPath(filter, path, newLogic);
    setFilter(newFilter);
    handleFilterOutput(newFilter);
  };

  const handleClearFilters = () => {
    const emptyFilter: FilterGroup = { logic: "and", filters: [] };
    setFilter(emptyFilter);
    handleFilterOutput(emptyFilter);
  };

  return (
    <div style={styles.root}>
      <FilterGroupComponent
        group={filter}
        path={[]}
        indentationLevel={0}
        onAddCondition={handleAddCondition}
        onAddGroup={handleAddGroup}
        onRemoveItem={handleRemoveItem}
        onUpdateCondition={handleUpdateCondition}
        onUpdateLogic={handleUpdateLogic}
        fieldsConfig={fieldsConfig}
        operators={defaultOperators}
        operatorsByField={operatorsByField}
        styles={styles}
        accessibilityLabels={accessibilityLabels}
      />
      {filter.filters.length > 0 && (
        <div style={styles.buttonGroup}>
          <Button
            onClick={handleClearFilters}
            style={styles.clearButton}
            aria-label={accessibilityLabels.clearFilters}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default InteractiveDataFilterBuilder;