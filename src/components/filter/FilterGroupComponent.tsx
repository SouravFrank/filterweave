import React from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';
import FilterConditionComponent from './FilterConditionComponent';
import { Condition, FilterGroupComponentProps, Group } from './interfaces';

const FilterGroupComponent: React.FC<FilterGroupComponentProps> = ({ 
  group, 
  path, 
  indentationLevel, 
  onAddCondition, 
  onAddGroup, 
  onRemoveItem, 
  onUpdateCondition, 
  onUpdateLogic, 
  fields, 
  operators,
  operatorsByField 
}) => {
  return (
    <div style={{ 
      marginLeft: indentationLevel * 20, 
      marginBottom: '16px',
      padding: '12px',
      backgroundColor: indentationLevel % 2 === 0 ? '#f5f5f5' : '#e9e9e9',
      borderRadius: '6px',
      border: '1px solid #ddd'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '12px',
        flexWrap: 'wrap'
      }}>
        <label style={{ marginRight: '8px', fontWeight: 'bold' }}>Logic:</label>
        <DropDownList
          value={group.logic}
          onChange={(e) => onUpdateLogic(path, e.value)}
          data={["and", "or"]}
          style={{ width: '100px', marginRight: '12px', marginBottom: '4px' }}
        />
        <Button 
          onClick={() => onAddCondition(path)} 
          style={{ marginRight: '8px', marginBottom: '4px' }}
          icon="plus"
          themeColor="primary"
        >
          Add Condition
        </Button>
        <Button 
          onClick={() => onAddGroup(path)}
          style={{ marginBottom: '4px' }}
          icon="folder-add"
        >
          Add Group
        </Button>
        {path.length > 0 && (
          <Button 
            onClick={() => onRemoveItem(path)}
            style={{ marginLeft: 'auto', marginBottom: '4px' }}
            icon="delete"
            themeColor="error"
          >
            Remove Group
          </Button>
        )}
      </div>
      
      {group.filters.length === 0 ? (
        <div style={{ padding: '10px', textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
          No filters added yet. Use the buttons above to add conditions or groups.
        </div>
      ) : (
        group.filters.map((item, index) => (
          <div key={index}>
            {'field' in item ? (
              <FilterConditionComponent
                condition={item as Condition}
                path={[...path, index]}
                onUpdateCondition={onUpdateCondition}
                onRemoveItem={onRemoveItem}
                fields={fields}
                operators={operators}
                operatorsByField={operatorsByField}
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
                operatorsByField={operatorsByField}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FilterGroupComponent;