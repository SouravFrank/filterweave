import React from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { TextBox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { FilterConditionComponentProps } from './interfaces';

interface Condition {
  field: string;
  operator: string;
  value: string;
}

const FilterConditionComponent: React.FC<FilterConditionComponentProps> = ({ condition, path, onUpdateCondition, onRemoveItem, fields, operators }) => {
  return (
    <div style={{ marginTop: '8px' }}>
      <DropDownList
        value={condition.field}
        onChange={(e) => onUpdateCondition(path, { ...condition, field: e.value })}
        data={fields}
        style={{ width: '150px', marginRight: '8px' }}
      />
      <DropDownList
        value={condition.operator}
        onChange={(e) => onUpdateCondition(path, { ...condition, operator: e.value })}
        data={operators}
        style={{ width: '150px', marginRight: '8px' }}
      />
      <TextBox
        value={condition.value}
        onChange={(e) => onUpdateCondition(path, { ...condition, value: String(e.value) })}
        style={{ width: '150px', marginRight: '8px' }}
      />
      <Button onClick={() => onRemoveItem(path)}>Remove</Button>
    </div>
  );
};

export default FilterConditionComponent;