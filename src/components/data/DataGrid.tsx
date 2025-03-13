import React from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Pager } from "@progress/kendo-react-data-tools";
import { SortDescriptor } from "@progress/kendo-data-query";

export interface DataItem {
  name: string;
  occupation: string;
  city: string;
}

interface DataGridProps {
  data: DataItem[];
  sort: SortDescriptor[];
  onSortChange: (sort: SortDescriptor[]) => void;
  page: { skip: number; take: number };
  total: number;
  onPageChange: (e: any) => void;
}

export const DataGrid: React.FC<DataGridProps> = ({
  data,
  sort,
  onSortChange,
  page,
  total,
  onPageChange,
}) => {
  return (
    <div className="data-grid-container">
      <Grid
        data={data.slice(page.skip, page.skip + page.take)}
        sortable={true}
        sort={sort}
        onSortChange={(e) => onSortChange(e.sort)}
        style={{ height: "500px" }}
        className="k-grid-modern"
      >
        <GridColumn field="name" title="Name" width="200px" />
        <GridColumn field="occupation" title="Occupation" width="200px" />
        <GridColumn field="city" title="City" width="150px" />
      </Grid>
      <Pager
        skip={page.skip}
        take={page.take}
        total={total}
        onPageChange={onPageChange}
        buttonCount={5}
        info={true}
        type="numeric"
        pageSizes={[5, 10, 20, 50]}
      />
      {data.length === 0 && (
        <div className="no-data">No data matches the current filter</div>
      )}
    </div>
  );
};