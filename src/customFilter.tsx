import React, { Component } from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { TextBox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';

// Default operators for string-based filtering (can be extended for other data types)
const operators = ["eq", "neq", "contains", "startswith", "endswith"];

/**
 * Helper function to add a new item (condition or group) to the filter at a specific path.
 * @param {Object} filter - The current filter object
 * @param {Array<number>} path - Array of indices indicating the target group
 * @param {Object} newItem - The new condition or group to add
 * @returns {Object} A new filter object with the item added
 */
function addItemToPath(filter, path, newItem) {
  if (path.length === 0) {
    return { ...filter, filters: [...filter.filters, newItem] };
  } else {
    const [index, ...restPath] = path;
    const child = filter.filters[index];
    if (!child || !child.filters) {
      throw new Error("Invalid path: not a group");
    }
    const updatedChild = addItemToPath(child, restPath, newItem);
    return {
      ...filter,
      filters: [
        ...filter.filters.slice(0, index),
        updatedChild,
        ...filter.filters.slice(index + 1)
      ]
    };
  }
}

/**
 * Helper function to remove an item (condition or group) from the filter at a specific path.
 * @param {Object} filter - The current filter object
 * @param {Array<number>} path - Array of indices pointing to the item to remove
 * @returns {Object} A new filter object with the item removed
 */
function removeItemFromPath(filter, path) {
  if (path.length === 1) {
    const index = path[0];
    return {
      ...filter,
      filters: filter.filters.filter((_, i) => i !== index)
    };
  } else {
    const [index, ...restPath] = path;
    const child = filter.filters[index];
    if (!child || !child.filters) {
      throw new Error("Invalid path");
    }
    const updatedChild = removeItemFromPath(child, restPath);
    return {
      ...filter,
      filters: [
        ...filter.filters.slice(0, index),
        updatedChild,
        ...filter.filters.slice(index + 1)
      ]
    };
  }
}

/**
 * Helper function to update a condition at a specific path.
 * @param {Object} filter - The current filter object
 * @param {Array<number>} path - Array of indices pointing to the condition
 * @param {Object} updatedCondition - The updated condition object
 * @returns {Object} A new filter object with the condition updated
 */
function updateConditionAtPath(filter, path, updatedCondition) {
  if (path.length === 1) {
    const index = path[0];
    const child = filter.filters[index];
    if (!child || child.logic) {
      throw new Error("Item is not a condition");
    }
    return {
      ...filter,
      filters: [
        ...filter.filters.slice(0, index),
        updatedCondition,
        ...filter.filters.slice(index + 1)
      ]
    };
  } else {
    const [index, ...restPath] = path;
    const child = filter.filters[index];
    if (!child || !child.filters) {
      throw new Error("Invalid path");
    }
    const updatedChild = updateConditionAtPath(child, restPath, updatedCondition);
    return {
      ...filter,
      filters: [
        ...filter.filters.slice(0, index),
        updatedChild,
        ...filter.filters.slice(index + 1)
      ]
    };
  }
}

/**
 * Helper function to update the logic of a group at a specific path.
 * @param {Object} filter - The current filter object
 * @param {Array<number>} path - Array of indices pointing to the group
 * @param {string} newLogic - The new logic value ("and" or "or")
 * @returns {Object} A new filter object with the logic updated
 */
function updateLogicAtPath(filter, path, newLogic) {
  if (path.length === 0) {
    return { ...filter, logic: newLogic };
  } else {
    const [index, ...restPath] = path;
    const child = filter.filters[index];
    if (!child || !child.logic) {
      throw new Error("Item is not a group");
    }
    const updatedChild = updateLogicAtPath(child, restPath, newLogic);
    return {
      ...filter,
      filters: [
        ...filter.filters.slice(0, index),
        updatedChild,
        ...filter.filters.slice(index + 1)
      ]
    };
  }
}

/**
 * Component to render a single filter condition.
 * @param {Object} props - Component props
 */
const FilterConditionComponent = ({ condition, path, onUpdateCondition, onRemoveItem, fields, operators }) => {
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
        onChange={(e) => onUpdateCondition(path, { ...condition, value: e.target.value })}
        style={{ width: '150px', marginRight: '8px' }}
      />
      <Button onClick={() => onRemoveItem(path)}>Remove</Button>
    </div>
  );
};

/**
 * Component to render a filter group, which can contain conditions or subgroups.
 * @param {Object} props - Component props
 */
const FilterGroupComponent = ({ group, path, indentationLevel, onAddCondition, onAddGroup, onRemoveItem, onUpdateCondition, onUpdateLogic, fields, operators }) => {
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
          {item.field ? (
            <FilterConditionComponent
              condition={item}
              path={[...path, index]}
              onUpdateCondition={onUpdateCondition}
              onRemoveItem={onRemoveItem}
              fields={fields}
              operators={operators}
            />
          ) : (
            <FilterGroupComponent
              group={item}
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

/**
 * Main component: InteractiveDataFilterBuilder
 * Allows users to build complex filter expressions dynamically.
 */
class InteractiveDataFilterBuilder extends Component {
  state = {
    filter: {
      logic: "and",
      filters: []
    }
  };

  // Adds a new condition to the filter at the specified path
  handleAddCondition = (path) => {
    const newCondition = { 
      field: this.props.fields[0] || "", 
      operator: operators[0] || "", 
      value: "" 
    };
    const newFilter = addItemToPath(this.state.filter, path, newCondition);
    this.setState({ filter: newFilter }, () => {
      if (this.props.onFilterChange) {
        this.props.onFilterChange(newFilter);
      }
    });
  };

  // Adds a new group to the filter at the specified path
  handleAddGroup = (path) => {
    const newGroup = { logic: "and", filters: [] };
    const newFilter = addItemToPath(this.state.filter, path, newGroup);
    this.setState({ filter: newFilter }, () => {
      if (this.props.onFilterChange) {
        this.props.onFilterChange(newFilter);
      }
    });
  };

  // Removes an item (condition or group) at the specified path
  handleRemoveItem = (path) => {
    const newFilter = removeItemFromPath(this.state.filter, path);
    this.setState({ filter: newFilter }, () => {
      if (this.props.onFilterChange) {
        this.props.onFilterChange(newFilter);
      }
    });
  };

  // Updates a condition at the specified path
  handleUpdateCondition = (path, updatedCondition) => {
    const newFilter = updateConditionAtPath(this.state.filter, path, updatedCondition);
    this.setState({ filter: newFilter }, () => {
      if (this.props.onFilterChange) {
        this.props.onFilterChange(newFilter);
      }
    });
  };

  // Updates the logic of a group at the specified path
  handleUpdateLogic = (path, newLogic) => {
    const newFilter = updateLogicAtPath(this.state.filter, path, newLogic);
    this.setState({ filter: newFilter }, () => {
      if (this.props.onFilterChange) {
        this.props.onFilterChange(newFilter);
      }
    });
  };

  // Clears all filters by resetting to an empty filter
  handleClearFilters = () => {
    const emptyFilter = { logic: "and", filters: [] };
    this.setState({ filter: emptyFilter }, () => {
      if (this.props.onFilterChange) {
        this.props.onFilterChange(emptyFilter);
      }
    });
  };

  render() {
    return (
      <div>
        <FilterGroupComponent
          group={this.state.filter}
          path={[]}
          indentationLevel={0}
          onAddCondition={this.handleAddCondition}
          onAddGroup={this.handleAddGroup}
          onRemoveItem={this.handleRemoveItem}
          onUpdateCondition={this.handleUpdateCondition}
          onUpdateLogic={this.handleUpdateLogic}
          fields={this.props.fields}
          operators={operators}
        />
        <Button onClick={this.handleClearFilters} style={{ marginTop: '16px' }}>
          Clear All Filters
        </Button>
      </div>
    );
  }
}

export default InteractiveDataFilterBuilder;

/**
 * Example usage:
 * 
 * <InteractiveDataFilterBuilder
 *   fields={["name", "age", "city"]}
 *   onFilterChange={(filter) => console.log(JSON.stringify(filter, null, 2))}
 * />
 * 
 * Example filter object generated:
 * {
 *   "logic": "and",
 *   "filters": [
 *     { "field": "name", "operator": "contains", "value": "John" },
 *     {
 *       "logic": "or",
 *       "filters": [
 *         { "field": "city", "operator": "eq", "value": "New York" },
 *         { "field": "city", "operator": "eq", "value": "Los Angeles" }
 *       ]
 *     }
 *   ]
 * }
 */

/**
 * Example function to filter an array of objects using the generated filter object:
 * 
 * @param {Array<Object>} data - The array of objects to filter
 * @param {Object} filter - The filter object from the component
 * @returns {Array<Object>} The filtered array
 */
function applyFilter(data, filter) {
  if (!filter || filter.filters.length === 0) {
    return data;
  }

  const { logic, filters } = filter;

  const filterFunctions = filters.map(f => {
    if (f.field) {
      // Handle condition
      return item => {
        const value = item[f.field];
        switch (f.operator) {
          case "eq": return value === f.value;
          case "neq": return value !== f.value;
          case "contains": return value.includes(f.value);
          case "startswith": return value.startsWith(f.value);
          case "endswith": return value.endsWith(f.value);
          default: return true;
        }
      };
    } else {
      // Handle nested group
      return item => applyFilter([item], f).length > 0;
    }
  });

  if (logic === "and") {
    return data.filter(item => filterFunctions.every(fn => fn(item)));
  } else {
    return data.filter(item => filterFunctions.some(fn => fn(item)));
  }
}

/**
 * Example data and usage:
 * const data = [
 *   { name: "John Doe", age: 25, city: "New York" },
 *   { name: "Jane Smith", age: 30, city: "Los Angeles" },
 *   { name: "Bob Johnson", age: 40, city: "Chicago" }
 * ];
 * const filter = {
 *   logic: "and",
 *   filters: [
 *     { field: "name", operator: "contains", "value": "John" },
 *     { logic: "or", filters: [
 *       { field: "city", operator: "eq", value: "New York" },
 *       { field: "city", operator: "eq", value: "Los Angeles" }
 *     ]}
 *   ]
 * };
 * const filteredData = applyFilter(data, filter);
 * // Result: [{ name: "John Doe", age: 25, city: "New York" }]
 */