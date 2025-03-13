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
} from "./interfaces";

/**
 * Main component for building interactive data filters with nested conditions and groups
 */
const InteractiveDataFilterBuilder: React.FC<InteractiveDataFilterBuilderProps> = ({
  fields,
  onFilterChange,
  operatorsByField,
}) => {
  const defaultOperators = ["eq", "neq", "contains", "startswith", "endswith"];
  const [filter, setFilter] = useState<FilterGroup>({
    logic: "and",
    filters: [],
  });

  const getOperatorsForField = (field: string): string[] => {
    return operatorsByField && operatorsByField[field]
      ? operatorsByField[field]
      : defaultOperators;
  };

  const handleAddCondition = (path: number[]) => {
    const selectedField = fields[0] || "";
    const operators = getOperatorsForField(selectedField);
    const newCondition: FilterCondition = {
      field: selectedField,
      operator: operators[0] || "eq",
      value: "",
    };
    const newFilter = addItemToPath(filter, path, newCondition);
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const handleAddGroup = (path: number[]) => {
    const newGroup: FilterGroup = { logic: "and", filters: [] };
    const newFilter = addItemToPath(filter, path, newGroup);
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const handleRemoveItem = (path: number[]) => {
    const newFilter = removeItemFromPath(filter, path);
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const handleUpdateCondition = (path: number[], updatedCondition: FilterCondition) => {
    const newFilter = updateConditionAtPath(filter, path, updatedCondition);
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const handleUpdateLogic = (path: number[], newLogic: string) => {
    const newFilter = updateLogicAtPath(filter, path, newLogic);
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const handleClearFilters = () => {
    const emptyFilter: FilterGroup = { logic: "and", filters: [] };
    setFilter(emptyFilter);
    onFilterChange?.(emptyFilter);
  };

  return (
    <div
      style={{
        border: "none", // Removed border
        borderRadius: "8px",
        padding: "16px",
        background: "transparent", // Transparent background
      }}
    >
      <FilterGroupComponent
        group={filter}
        path={[]}
        indentationLevel={0}
        onAddCondition={handleAddCondition}
        onAddGroup={handleAddGroup}
        onRemoveItem={handleRemoveItem}
        onUpdateCondition={handleUpdateCondition}
        onUpdateLogic={handleUpdateLogic}
        fields={fields}
        operators={defaultOperators}
        operatorsByField={operatorsByField}
      />
      {filter.filters.length > 0 && (
        <div style={{ marginTop: "16px", textAlign: "right" }}>
          <Button
            onClick={handleClearFilters}
            themeColor="warning"
            icon="filter-clear"
            style={{
              background: "rgba(255, 165, 0, 0.2)",
              color: "#fff",
              border: "none",
              backdropFilter: "blur(5px)",
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default InteractiveDataFilterBuilder;