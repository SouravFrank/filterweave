import { useState, useEffect } from "react";
import "./App.css";
import InteractiveDataFilterBuilder from "./components/filter/InteractiveDataFilterBuilder";
import { DataGrid } from "./components/data/DataGrid";
import {
  FilterGroup,
  OperatorConfig,
  FieldConfig,
} from "./components/filter/interfaces";
import { DataService } from "./services/DataService";
import { SortDescriptor } from "@progress/kendo-data-query";

const operatorsByType: { [key: string]: string[] } = {
  string: ["eq", "neq", "contains", "startswith", "endswith"],
  number: ["eq", "neq", "gt", "lt", "gte", "lte"],
  boolean: ["eq", "neq"],
  date: ["eq", "neq", "gt", "lt", "gte", "lte"],
};

const dataService = new DataService();

function App() {
  const [filter, setFilter] = useState<FilterGroup | null>(null);
  const [sort, setSort] = useState<SortDescriptor[]>([
    { field: "name", dir: "asc" },
  ]);
  const [page, setPage] = useState({ skip: 0, take: 10 });
  const [fieldsConfig, setFieldsConfig] = useState<FieldConfig[]>([]);
  const [operatorsByField, setOperatorsByField] = useState<{
    [key: string]: OperatorConfig[];
  }>({});

  // Initialize fields and operators dynamically based on the data
  useEffect(() => {
    const sampleData = dataService.getAllData();

    if (sampleData.length > 0) {
      const firstItem = sampleData[0];
      const dynamicFields: FieldConfig[] = [];
      const dynamicFieldTypes: { [key: string]: string } = {};

      // Extract field names and determine their types
      Object.entries(firstItem).forEach(([key, value]) => {
        // Determine the type of the field
        let dataType: 'string' | 'number' | 'date' | 'boolean' = 'string'; // Default to string

        if (typeof value === "number") {
          dataType = 'number';
        } else if (typeof value === "boolean") {
          dataType = 'boolean';
        } else if (value instanceof Date) {
          dataType = 'date';
        } else if (typeof value === "string") {
          const dateValue = new Date(value);
          if (!isNaN(dateValue.getTime()) && value.includes("-")) {
            dataType = 'date';
          }
        }

        dynamicFields.push({ name: key, label: key, dataType }); // Convert to FieldConfig

        // Store the type in dynamicFieldTypes
        dynamicFieldTypes[key] = dataType;
      });

      // Set the fields
      setFieldsConfig(dynamicFields);

      // Compute operators for each field
      const dynamicOperatorsByField: { [key: string]: OperatorConfig[] } = {};
      dynamicFields.forEach((field) => {
        const type = dynamicFieldTypes[field.name] || "string";
        const operatorNames =
          operatorsByType[type as keyof typeof operatorsByType] ||
          operatorsByType.string;
        dynamicOperatorsByField[field.name] = operatorNames.map((name) => ({
          name,
          label: name.toUpperCase(), // Simple label transformation
          logic: (f: string, v: string) => `${f} ${name} ${v}`, // Default logic
        }));
      });

      setOperatorsByField(dynamicOperatorsByField);
    }
  }, []);

  const displayedData = dataService.getFilteredAndSortedData(filter, sort);

  return (
    <div className="app-container">
      <h1>Interactive Data Filter Demo</h1>
      <div className="main-content">
        <div className="filter-section">
          <h2>Filter Data</h2>
          {fieldsConfig.length > 0 ? (
            <InteractiveDataFilterBuilder
              fieldsConfig={fieldsConfig}
              operatorsByField={operatorsByField}
              onFilterChange={(newFilter) =>
                setFilter(newFilter as FilterGroup)
              }
            />
          ) : (
            <div>Loading fields...</div>
          )}
        </div>
        <div className="grid-section">
          <h2>Data ({displayedData.length} records)</h2>
          <DataGrid
            data={displayedData}
            sort={sort}
            onSortChange={setSort}
            page={page}
            total={displayedData.length}
            onPageChange={(e) => setPage({ skip: e.skip, take: e.take })}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
