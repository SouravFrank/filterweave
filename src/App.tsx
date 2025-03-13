import React, { useState } from 'react';
import './App.css';
import InteractiveDataFilterBuilder from './components/InteractiveDataFilterBuilder';
import { DataItem, FilterGroup } from './interfaces';

// Dummy data for demonstration
const dummyData: DataItem[] = [
  { name: "John Doe", age: 25, city: "New York" },
  { name: "Jane Smith", age: 30, city: "Los Angeles" },
  { name: "Bob Johnson", age: 40, city: "Chicago" },
  { name: "Alice Brown", age: 28, city: "Seattle" },
  { name: "Tom Wilson", age: 35, city: "Boston" }
];

// Fields available for filtering
const fields = ["name", "age", "city"];

// Define field types for proper operator handling
const fieldTypes: { [key: string]: 'string' | 'number' } = {
  name: "string",
  age: "number",
  city: "string"
};

// Define operators based on field types
const operatorsByType = {
  string: ["eq", "neq", "contains", "startswith", "endswith"],
  number: ["eq", "neq", "gt", "lt", "gte", "lte"]
};

// Compute operators for each field
const operatorsByField: { [key: string]: string[] } = {};
fields.forEach(field => {
  const type = fieldTypes[field] || "string";
  operatorsByField[field] = operatorsByType[type];
});

// Function to apply the filter to the data
function applyFilter(data: DataItem[], filter: FilterGroup | null): DataItem[] {
  if (!filter || filter.filters.length === 0) {
    return data;
  }

  const { logic, filters } = filter;

  const filterFunctions = filters.map(f => {
    if ("field" in f) {
      // Handle individual condition
      return (item: DataItem): boolean => {
        const value = item[f.field as keyof DataItem];
        let filterValue: string | number = f.value;
        
        // Convert filter value to number if the field is 'age'
        if (f.field === "age") {
          filterValue = Number(f.value);
          if (isNaN(filterValue)) return false;
        }

        switch (f.operator) {
          case "eq":
            return value === filterValue;
          case "neq":
            return value !== filterValue;
          case "contains":
            return typeof value === "string" && value.toLowerCase().includes(String(filterValue).toLowerCase());
          case "startswith":
            return typeof value === "string" && value.toLowerCase().startsWith(String(filterValue).toLowerCase());
          case "endswith":
            return typeof value === "string" && value.toLowerCase().endsWith(String(filterValue).toLowerCase());
          case "gt":
            return typeof value === "number" && value > (filterValue as number);
          case "lt":
            return typeof value === "number" && value < (filterValue as number);
          case "gte":
            return typeof value === "number" && value >= (filterValue as number);
          case "lte":
            return typeof value === "number" && value <= (filterValue as number);
          default:
            return true;
        }
      };
    } else {
      // Handle nested filter group
      return (item: DataItem) => applyFilter([item], f as FilterGroup).length > 0;
    }
  });

  return data.filter(item =>
    logic === "and"
      ? filterFunctions.every(fn => fn(item))
      : filterFunctions.some(fn => fn(item))
  );
}

function App() {
  // State to hold the current filter
  const [filter, setFilter] = useState<FilterGroup | null>(null);

  // Compute the displayed data based on the filter
  const displayedData = applyFilter(dummyData, filter);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Interactive Data Filter Demo
      </h1>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Filter Builder Section */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2>Filter Data</h2>
          <InteractiveDataFilterBuilder
            fields={fields}
            // operatorOptions={operatorsByField}
            onFilterChange={(newFilter) => setFilter(newFilter as FilterGroup)}
          />
        </div>
        {/* Data Table Section */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2>Data</h2>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Age</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>City</th>
              </tr>
            </thead>
            <tbody>
              {displayedData.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{item.name}</td>
                  <td style={{ padding: '10px' }}>{item.age}</td>
                  <td style={{ padding: '10px' }}>{item.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;