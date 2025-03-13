import { FilterGroup, FilterCondition } from './interfaces';

/**
 * Adds an item (condition or group) to the filter at the specified path
 */
export function addItemToPath(
  filter: FilterGroup,
  path: number[],
  item: FilterCondition | FilterGroup
): FilterGroup {
  if (path.length === 0) {
    return { ...filter, filters: [...filter.filters, item] };
  }

  const newFilters = [...filter.filters];
  let current = newFilters;
  for (let i = 0; i < path.length - 1; i++) {
    current = (current[path[i]] as FilterGroup).filters as (FilterCondition | FilterGroup)[];
  }
  current[path[path.length - 1]] = {
    ...(current[path[path.length - 1]] as FilterGroup),
    filters: [...(current[path[path.length - 1]] as FilterGroup).filters, item],
  };
  return { ...filter, filters: newFilters };
}

/**
 * Removes an item (condition or group) from the filter at the specified path
 */
export function removeItemFromPath(filter: FilterGroup, path: number[]): FilterGroup {
  if (path.length === 0) return filter;

  const newFilters = [...filter.filters];
  let current = newFilters;
  for (let i = 0; i < path.length - 1; i++) {
    current = (current[path[i]] as FilterGroup).filters as (FilterCondition | FilterGroup)[];
  }
  current.splice(path[path.length - 1], 1);
  return { ...filter, filters: newFilters };
}

/**
 * Updates a condition at the specified path in the filter
 */
export function updateConditionAtPath(
  filter: FilterGroup,
  path: number[],
  updatedCondition: FilterCondition
): FilterGroup {
  const newFilters = [...filter.filters];
  let current = newFilters;
  for (let i = 0; i < path.length - 1; i++) {
    current = (current[path[i]] as FilterGroup).filters as (FilterCondition | FilterGroup)[];
  }
  current[path[path.length - 1]] = updatedCondition;
  return { ...filter, filters: newFilters };
}

/**
 * Updates the logic ('and'/'or') at the specified path in the filter
 */
export function updateLogicAtPath(filter: FilterGroup, path: number[], newLogic: string): FilterGroup {
  if (path.length === 0) {
    return { ...filter, logic: newLogic as 'and' | 'or' };
  }

  const newFilters = [...filter.filters];
  let current = newFilters;
  for (let i = 0; i < path.length - 1; i++) {
    current = (current[path[i]] as FilterGroup).filters as (FilterCondition | FilterGroup)[];
  }
  current[path[path.length - 1]] = {
    ...(current[path[path.length - 1]] as FilterGroup),
    logic: newLogic as 'and' | 'or',
  };
  return { ...filter, filters: newFilters };
}