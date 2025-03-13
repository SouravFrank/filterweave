import React from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import FilterConditionComponent from "./FilterConditionComponent";
import {
  FilterGroupComponentProps,
  FilterCondition,
  FilterGroup,
} from "./interfaces"; // Assuming updated path from previous structure

/**
 * Component for rendering and managing a filter group with nested conditions or groups
 */
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
  operatorsByField,
}) => {
  const handleLogicChange = (e: any) => {
    onUpdateLogic(path, e.value);
  };

  return (
    <div
      style={{
        marginLeft: indentationLevel * 20,
        marginBottom: "16px",
        padding: "12px",
        background: indentationLevel % 2 === 0
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(255, 255, 255, 0.08)", // Subtle alternating transparency
        borderRadius: "8px",
        border: "none", // Removed border for less boxiness
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
          flexWrap: "wrap",
          gap: "10px", // Added gap for better spacing
        }}
      >
        <label
          style={{
            marginRight: "8px",
            fontWeight: "bold",
            color: "#fff",
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          Logic:
        </label>
        <DropDownList
          value={group.logic}
          onChange={handleLogicChange}
          data={["and", "or"]}
          style={{
            width: "100px",
            background: "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            border: "none",
            backdropFilter: "blur(5px)",
          }}
        />
        <Button
          onClick={() => onAddCondition(path)}
          icon="plus"
          themeColor="primary"
          style={{
            background: "rgba(0, 123, 255, 0.2)",
            color: "#fff",
            border: "none",
            backdropFilter: "blur(5px)",
          }}
        >
          Add Condition
        </Button>
        <Button
          onClick={() => onAddGroup(path)}
          icon="folder-add"
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            color: "#fff",
            border: "none",
            backdropFilter: "blur(5px)",
          }}
        >
          Add Group
        </Button>
        {path.length > 0 && (
          <Button
            onClick={() => onRemoveItem(path)}
            icon="delete"
            themeColor="error"
            style={{
              marginLeft: "auto",
              background: "rgba(255, 0, 0, 0.2)",
              color: "#fff",
              border: "none",
              backdropFilter: "blur(5px)",
            }}
          >
            Remove Group
          </Button>
        )}
      </div>

      {group.filters.length === 0 ? (
        <div
          style={{
            padding: "10px",
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.7)",
            fontStyle: "italic",
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          No filters added yet. Use the buttons above to add conditions or groups.
        </div>
      ) : (
        group.filters.map((item, index) => (
          <div key={index}>
            {"field" in item ? (
              <FilterConditionComponent
                condition={item as FilterCondition}
                path={[...path, index]}
                onUpdateCondition={onUpdateCondition}
                onRemoveItem={onRemoveItem}
                fields={fields}
                operators={operators}
                operatorsByField={operatorsByField}
              />
            ) : (
              <FilterGroupComponent
                group={item as FilterGroup}
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