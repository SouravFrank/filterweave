import React from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';
import FilterConditionComponent from './FilterConditionComponent';
import { Condition, FilterGroupComponentProps, Group } from './interfaces';

const FilterGroupComponent: React.FC<FilterGroupComponentProps> = ({ group, path, indentationLevel, onAddCondition, onAddGroup, onRemoveItem, onUpdateCondition, onUpdateLogic, fields, operators }) => {
  return (
    <div style={{ marginLeft: indentationLevel * 20, marginBottom: '16px' }}>
      <div>
        <DropDownList
          value={group.logic}
          onChange={(e) => onUpdateLogic(path, e.value)}
          data={["and", "or"]}
          style={{ width: '100px', marginRight: '8px' }}
        />
        <Button onClick={() => onAddCondition(path)} style={{ marginRight: '8px' }}>
          Add Condition
        </Button>
        <Button onClick={() => onAddGroup(path)}>
          Add Group
        </Button>
      </div>
      {group.filters.map((item, index) => (
        <div key={index}>
          {'field' in item ? (
            <FilterConditionComponent
              condition={item as Condition}
              path={[...path, index]}
              onUpdateCondition={onUpdateCondition}
              onRemoveItem={onRemoveItem}
              fields={fields}
              operators={operators}
            />
          ) : (
            <FilterGroupComponent
              group={item as Group}
              path={[...path, index]}
              indentationLevel={indentationLevel + 1}
              onAddCondition={onAddCondition}
              onAddGroup={onAddGroup}
              onRemoveItem={onRemoveItem}
              onUpdateCondition={onUpdateCondition}
              onUpdateLogic={onUpdateLogic}
              fields={fields}
              operators={operators}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default FilterGroupComponent;