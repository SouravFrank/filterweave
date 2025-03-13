interface Condition {
  field: string;
  operator: string;
  value: string;
}

interface Group {
  logic: string;
  filters: Array<Condition | Group>;
}

export function addItemToPath(filter: Group, path: number[], newItem: Condition | Group): Group {
  if (path.length === 0) {
    return { ...filter, filters: [...filter.filters, newItem] };
  } else {
    const [index, ...restPath] = path;
    const child = filter.filters[index];
    if (!child || !('filters' in child)) {
      throw new Error("Invalid path: not a group");
    }
    const updatedChild = addItemToPath(child as Group, restPath, newItem);
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

export function removeItemFromPath(filter: Group, path: number[]): Group {
  if (path.length === 1) {
    const index = path[0];
    return {
      ...filter,
      filters: filter.filters.filter((_, i) => i !== index)
    };
  } else {
    const [index, ...restPath] = path;
    const child = filter.filters[index];
    if (!child || !('filters' in child)) {
      throw new Error("Invalid path");
    }
    const updatedChild = removeItemFromPath(child as Group, restPath);
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

export function updateConditionAtPath(filter: Group, path: number[], updatedCondition: Condition): Group {
  if (path.length === 1) {
    const index = path[0];
    const child = filter.filters[index];
    if (!child || 'logic' in child) {
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
    if (!child || !('filters' in child)) {
      throw new Error("Invalid path");
    }
    const updatedChild = updateConditionAtPath(child as Group, restPath, updatedCondition);
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

export function updateLogicAtPath(filter: Group, path: number[], newLogic: string): Group {
  if (path.length === 0) {
    return { ...filter, logic: newLogic };
  } else {
    const [index, ...restPath] = path;
    const child = filter.filters[index];
    if (!child || !('logic' in child)) {
      throw new Error("Item is not a group");
    }
    const updatedChild = updateLogicAtPath(child as Group, restPath, newLogic);
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