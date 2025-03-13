import { useState, useEffect } from "react";
import "./App.css";
import InteractiveDataFilterBuilder from "./components/filter/InteractiveDataFilterBuilder";
import { DataGrid } from "./components/data/DataGrid";
import { FilterGroup } from "./components/filter/interfaces"; // Updated import path
import { DataService } from "./services/DataService";
import { SortDescriptor } from "@progress/kendo-data-query";

const operatorsByType = {
  string: ["eq", "neq", "contains", "startswith", "endswith"],
  number: ["eq", "neq", "gt", "lt", "gte", "lte"],
  boolean: ["eq", "neq"],
  date: ["eq", "neq", "gt", "lt", "gte", "lte"],
};

const dataService = new DataService();

function App() {
  const [filter, setFilter] = useState<FilterGroup | null>(null);
  const [sort, setSort] = useState<SortDescriptor[]>([{ field: "name", dir: "asc" }]);
  const [page, setPage] = useState({ skip: 0, take: 10 });
  const [fields, setFields] = useState<string[]>([]);
  const [fieldTypes, setFieldTypes] = useState<{ [key: string]: string }>({});
  const [operatorsByField, setOperatorsByField] = useState<{ [key: string]: string[] }>({});

  // Initialize fields and field types dynamically based on the data
  useEffect(() => {
    // Get a sample of the data to determine field types
    const sampleData = dataService.getAllData();
    
    if (sampleData.length > 0) {
      const firstItem = sampleData[0];
      const dynamicFields: string[] = [];
      const dynamicFieldTypes: { [key: string]: string } = {};
      
      // Extract field names and determine their types
      Object.entries(firstItem).forEach(([key, value]) => {
        dynamicFields.push(key);
        
        // Determine the type of the field
        if (typeof value === 'number') {
          dynamicFieldTypes[key] = 'number';
        } else if (typeof value === 'boolean') {
          dynamicFieldTypes[key] = 'boolean';
        } else if (value instanceof Date) {
          dynamicFieldTypes[key] = 'date';
        } else if (typeof value === 'string') {
          // Check if string is a date
          const dateValue = new Date(value);
          if (!isNaN(dateValue.getTime()) && value.includes('-')) {
            dynamicFieldTypes[key] = 'date';
          } else {
            dynamicFieldTypes[key] = 'string';
          }
        } else {
          // Default to string for complex types or null/undefined
          dynamicFieldTypes[key] = 'string';
        }
      });
      
      // Set the fields and field types
      setFields(dynamicFields);
      setFieldTypes(dynamicFieldTypes);
      
      // Compute operators for each field
      const dynamicOperatorsByField: { [key: string]: string[] } = {};
      dynamicFields.forEach(field => {
        const type = dynamicFieldTypes[field] || 'string';
        dynamicOperatorsByField[field] = operatorsByType[type as keyof typeof operatorsByType] || operatorsByType.string;
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
          {fields.length > 0 ? (
            <InteractiveDataFilterBuilder
              fields={fields}
              operatorsByField={operatorsByField}
              onFilterChange={(newFilter) => setFilter(newFilter as FilterGroup)}
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