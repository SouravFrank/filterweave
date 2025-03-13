import { useState } from "react";
import "./App.css";
import InteractiveDataFilterBuilder from "./components/filter/InteractiveDataFilterBuilder";
import { DataGrid } from "./components/data/DataGrid";
import { FilterGroup } from "./interfaces";
import { DataService } from "./services/DataService";
import { SortDescriptor } from "@progress/kendo-data-query";

const fields = ["name", "age", "city"];
const fieldTypes: { [key: string]: "string" | "number" } = {
  name: "string",
  age: "number",
  city: "string",
};
const operatorsByType = {
  string: ["eq", "neq", "contains", "startswith", "endswith"],
  number: ["eq", "neq", "gt", "lt", "gte", "lte"],
};
const operatorsByField: { [key: string]: string[] } = {};
fields.forEach((field) => {
  operatorsByField[field] = operatorsByType[fieldTypes[field] || "string"];
});

const dataService = new DataService();

function App() {
  const [filter, setFilter] = useState<FilterGroup | null>(null);
  const [sort, setSort] = useState<SortDescriptor[]>([
    { field: "name", dir: "asc" },
  ]);
  const [page, setPage] = useState({ skip: 0, take: 10 });

  const displayedData = dataService.getFilteredAndSortedData(filter, sort);

  return (
    <div className="app-container">
      <h1>Interactive Data Filter Demo</h1>
      <div className="main-content">
        <div className="filter-section">
          <h2>Filter Data</h2>
          <InteractiveDataFilterBuilder
            fields={fields}
            operatorsByField={operatorsByField}
            onFilterChange={(newFilter) => setFilter(newFilter as FilterGroup)}
          />
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
