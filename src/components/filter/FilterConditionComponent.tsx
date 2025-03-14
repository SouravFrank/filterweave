import React, { useEffect, useState } from 'react';
import '@progress/kendo-theme-default/dist/all.css';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { TextBox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { FilterConditionComponentProps, OperatorConfig } from './interfaces';

/**
 * Component for rendering and managing a single filter condition
 */
const FilterConditionComponent: React.FC<FilterConditionComponentProps> = ({
  condition,
  path,
  onUpdateCondition,
  onRemoveItem,
  fieldsConfig,
  operators,
  operatorsByField,
}) => {
  // Update state type to match OperatorConfig[]
  const [availableOperators, setAvailableOperators] = useState<OperatorConfig[]>(operators || []);

  // Transform fieldsConfig array into the required format for DropDownList
  const fieldOptions = fieldsConfig.map(field => ({
    text: field.label,
    value: field.name,
  }));

  useEffect(() => {
    if (operatorsByField && condition.field) {
      setAvailableOperators(operatorsByField[condition.field] || operators || []);
    }
  }, [condition.field, operatorsByField, operators]);

  const handleFieldChange = (e: any) => {
    const newField = e.value.value;
    const newOperators = operatorsByField ? operatorsByField[newField] || operators || [] : operators || [];
    const newOperator = newOperators.find(op => op.name === condition.operator)?.name || newOperators[0]?.name || '';
    onUpdateCondition(path, { ...condition, field: newField, operator: newOperator });
  };

  const handleOperatorChange = (e: any) => {
    onUpdateCondition(path, { ...condition, operator: e.value.name });
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
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        border: 'none',
        backdropFilter: 'blur(5px)',
        gap: '10px',
      }}
    >
      <DropDownList
        value={fieldOptions.find(option => option.value === condition.field) || null}
        onChange={handleFieldChange}
        data={fieldOptions}
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
        value={availableOperators.find(op => op.name === condition.operator) || null}
        onChange={handleOperatorChange}
        data={availableOperators}
        textField="label"
        dataItemKey="name"
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
          background: 'rgba(255, 0, 0, 0.2)',
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