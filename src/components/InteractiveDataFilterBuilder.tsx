import React, { useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import FilterGroupComponent from './FilterGroupComponent';
import { addItemToPath, removeItemFromPath, updateConditionAtPath, updateLogicAtPath } from '../helpers/filterHelpers';
import { InteractiveDataFilterBuilderProps, Group, Condition } from './interfaces';

// Default operators if not provided through props
const defaultOperators = ["eq", "neq", "contains", "startswith", "endswith"];

const InteractiveDataFilterBuilder: React.FC<InteractiveDataFilterBuilderProps> = ({ 
  fields, 
  onFilterChange,
  operatorsByField 
}) => {
  const [filter, setFilter] = useState<Group>({
    logic: "and",
    filters: []
  });

  // Determine which operators to use for a given field
  const getOperatorsForField = (field: string): string[] => {
    if (operatorsByField && operatorsByField[field]) {
      return operatorsByField[field];
    }
    return defaultOperators;
  };

  const handleAddCondition = (path: number[]) => {
    const selectedField = fields[0] || "";
    const operators = getOperatorsForField(selectedField);
    
    const newCondition: Condition = { 
      field: selectedField, 
      operator: operators[0] || "eq", 
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
    <div style={{ 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      padding: '16px',
      backgroundColor: '#fff'
    }}>
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
        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <Button 
            onClick={handleClearFilters} 
            themeColor="warning"
            icon="filter-clear"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default InteractiveDataFilterBuilder;