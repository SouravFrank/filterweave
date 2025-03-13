import React, { useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import FilterGroupComponent from './FilterGroupComponent';
import { addItemToPath, removeItemFromPath, updateConditionAtPath, updateLogicAtPath } from '../helpers/filterHelpers';
import { InteractiveDataFilterBuilderProps, Group, Condition } from './interfaces';

const operators = ["eq", "neq", "contains", "startswith", "endswith"];

const InteractiveDataFilterBuilder: React.FC<InteractiveDataFilterBuilderProps> = ({ fields, onFilterChange }) => {
  const [filter, setFilter] = useState<Group>({
    logic: "and",
    filters: []
  });

  const handleAddCondition = (path: number[]) => {
    const newCondition: Condition = { 
      field: fields[0] || "", 
      operator: operators[0] || "", 
      value: "" 
    };
    const newFilter = addItemToPath(filter, path, newCondition);
    setFilter(newFilter);
    if (onFilterChange) {
      onFilterChange(newFilter);
    }
  };

  const handleAddGroup = (path: number[]) => {
    const newGroup: Group = { logic: "and", filters: [] };
    const newFilter = addItemToPath(filter, path, newGroup);
    setFilter(newFilter);
    if (onFilterChange) {
      onFilterChange(newFilter);
    }
  };

  const handleRemoveItem = (path: number[]) => {
    const newFilter = removeItemFromPath(filter, path);
    setFilter(newFilter);
    if (onFilterChange) {
      onFilterChange(newFilter);
    }
  };

  const handleUpdateCondition = (path: number[], updatedCondition: Condition) => {
    const newFilter = updateConditionAtPath(filter, path, updatedCondition);
    setFilter(newFilter);
    if (onFilterChange) {
      onFilterChange(newFilter);
    }
  };

  const handleUpdateLogic = (path: number[], newLogic: string) => {
    const newFilter = updateLogicAtPath(filter, path, newLogic);
    setFilter(newFilter);
    if (onFilterChange) {
      onFilterChange(newFilter);
    }
  };

  const handleClearFilters = () => {
    const emptyFilter: Group = { logic: "and", filters: [] };
    setFilter(emptyFilter);
    if (onFilterChange) {
      onFilterChange(emptyFilter);
    }
  };

  return (
    <div>
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
        operators={operators}
      />
      <Button onClick={handleClearFilters} style={{ marginTop: '16px' }}>
        Clear All Filters
      </Button>
    </div>
  );
};

export default InteractiveDataFilterBuilder;