import React, { useEffect, useState } from 'react';
import '@progress/kendo-theme-default/dist/all.css'; // Default KendoReact theme
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { TextBox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { FilterConditionComponentProps } from './interfaces';

const FilterConditionComponent: React.FC<FilterConditionComponentProps> = ({ 
  condition, 
  path, 
  onUpdateCondition, 
  onRemoveItem, 
  fields, 
  operators,
  operatorsByField 
}) => {
  const [availableOperators, setAvailableOperators] = useState<string[]>(operators || []);

  // Update operators when field changes
  useEffect(() => {
    if (operatorsByField && condition.field) {
      setAvailableOperators(operatorsByField[condition.field] || operators);
    }
  }, [condition.field, operatorsByField, operators]);

  return (
    <div style={{ 
      marginTop: '8px', 
      display: 'flex', 
      alignItems: 'center',
      flexWrap: 'wrap',
      padding: '8px',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <DropDownList
        value={condition.field}
        onChange={(e) => {
          const newField = e.value;
          // Reset operator when field changes to ensure compatibility
          const newOperators = operatorsByField ? operatorsByField[newField] || operators : operators;
          const newOperator = newOperators.includes(condition.operator) ? condition.operator : newOperators[0];
          onUpdateCondition(path, { ...condition, field: newField, operator: newOperator });
        }}
        data={fields}
        textField="text"
        dataItemKey="value"
        style={{ width: '150px', marginRight: '8px', marginBottom: '4px' }}
      />
      <DropDownList
        value={condition.operator}
        onChange={(e) => onUpdateCondition(path, { ...condition, operator: e.value })}
        data={availableOperators}
        style={{ width: '150px', marginRight: '8px', marginBottom: '4px' }}
      />
      <TextBox
        value={condition.value}
        onChange={(e) => onUpdateCondition(path, { ...condition, value: String(e.value) })}
        style={{ width: '150px', marginRight: '8px', marginBottom: '4px' }}
      />
      <Button 
        onClick={() => onRemoveItem(path)}
        icon="delete"
        style={{ marginBottom: '4px' }}
      >
        Remove
      </Button>
    </div>
  );
};

export default FilterConditionComponent;