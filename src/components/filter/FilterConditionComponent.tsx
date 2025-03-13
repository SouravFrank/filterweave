import React, { useEffect, useState } from 'react';
import '@progress/kendo-theme-default/dist/all.css';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { TextBox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { FilterConditionComponentProps } from './interfaces'; // Updated path assumption

/**
 * Component for rendering and managing a single filter condition
 */
const FilterConditionComponent: React.FC<FilterConditionComponentProps> = ({
  condition,
  path,
  onUpdateCondition,
  onRemoveItem,
  fields,
  operators,
  operatorsByField,
}) => {
  const [availableOperators, setAvailableOperators] = useState<string[]>(operators);

  useEffect(() => {
    if (operatorsByField && condition.field) {
      setAvailableOperators(operatorsByField[condition.field] || operators);
    }
  }, [condition.field, operatorsByField, operators]);

  const handleFieldChange = (e: any) => {
    const newField = e.value;
    const newOperators = operatorsByField ? operatorsByField[newField] || operators : operators;
    const newOperator = newOperators.includes(condition.operator) ? condition.operator : newOperators[0];
    onUpdateCondition(path, { ...condition, field: newField, operator: newOperator });
  };

  const handleOperatorChange = (e: any) => {
    onUpdateCondition(path, { ...condition, operator: e.value });
  };

  const handleValueChange = (e: any) => {
    onUpdateCondition(path, { ...condition, value: String(e.value) });
  };

  return (
    <div
      style={{
        marginTop: '8px',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '8px',
        background: 'rgba(255, 255, 255, 0.05)', // Subtle transparency
        borderRadius: '8px',
        border: 'none', // Removed border
        backdropFilter: 'blur(5px)', // Glass effect
        gap: '10px', // Added gap for spacing
      }}
    >
      <DropDownList
        value={condition.field}
        onChange={handleFieldChange}
        data={fields}
        textField="text"
        dataItemKey="value"
        style={{
          width: '150px',
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#fff',
          border: 'none',
          backdropFilter: 'blur(5px)',
        }}
      />
      <DropDownList
        value={condition.operator}
        onChange={handleOperatorChange}
        data={availableOperators}
        style={{
          width: '150px',
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#fff',
          border: 'none',
          backdropFilter: 'blur(5px)',
        }}
      />
      <TextBox
        value={condition.value}
        onChange={handleValueChange}
        style={{
          width: '150px',
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#fff',
          border: 'none',
          backdropFilter: 'blur(5px)',
        }}
      />
      <Button
        onClick={() => onRemoveItem(path)}
        icon="delete"
        style={{
          background: 'rgba(255, 0, 0, 0.2)', // Red tint for delete
          color: '#fff',
          border: 'none',
          backdropFilter: 'blur(5px)',
        }}
      >
        Remove
      </Button>
    </div>
  );
};

export default FilterConditionComponent;