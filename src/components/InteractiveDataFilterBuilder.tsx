import { Component } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import FilterGroupComponent from './FilterGroupComponent';
import { addItemToPath, removeItemFromPath, updateConditionAtPath, updateLogicAtPath } from '../helpers/filterHelpers';
import { InteractiveDataFilterBuilderProps, InteractiveDataFilterBuilderState, Condition, Group } from './interfaces';

const operators = ["eq", "neq", "contains", "startswith", "endswith"];

class InteractiveDataFilterBuilder extends Component<InteractiveDataFilterBuilderProps, InteractiveDataFilterBuilderState> {
  state: InteractiveDataFilterBuilderState = {
    filter: {
      logic: "and",
      filters: []
    }
  };

  handleAddCondition = (path: number[]) => {
    const newCondition: Condition = { 
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

  handleAddGroup = (path: number[]) => {
    const newGroup: Group = { logic: "and", filters: [] };
    const newFilter = addItemToPath(this.state.filter, path, newGroup);
    this.setState({ filter: newFilter }, () => {
      if (this.props.onFilterChange) {
        this.props.onFilterChange(newFilter);
      }
    });
  };

  handleRemoveItem = (path: number[]) => {
    const newFilter = removeItemFromPath(this.state.filter, path);
    this.setState({ filter: newFilter }, () => {
      if (this.props.onFilterChange) {
        this.props.onFilterChange(newFilter);
      }
    });
  };

  handleUpdateCondition = (path: number[], updatedCondition: Condition) => {
    const newFilter = updateConditionAtPath(this.state.filter, path, updatedCondition);
    this.setState({ filter: newFilter }, () => {
      if (this.props.onFilterChange) {
        this.props.onFilterChange(newFilter);
      }
    });
  };

  handleUpdateLogic = (path: number[], newLogic: string) => {
    const newFilter = updateLogicAtPath(this.state.filter, path, newLogic);
    this.setState({ filter: newFilter }, () => {
      if (this.props.onFilterChange) {
        this.props.onFilterChange(newFilter);
      }
    });
  };

  handleClearFilters = () => {
    const emptyFilter: Group = { logic: "and", filters: [] };
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