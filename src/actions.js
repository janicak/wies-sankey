export const setAppState = (newState) => ({
  type: 'SET_APP_STATE',
  newState
});

export const setSelectedNodes = (nodes) => ({
  type: 'SET_SELECTED_NODES',
  nodes
});

export const setSelectedRowsAndColFilter = (rows, colFilter, eventSource) => ({
  type: 'SET_SELECTED_ROWS_AND_COL_FILTER',
  rows,
  colFilter,
  eventSource
});

export const setColFilter = (filter, eventSource) => ({
  type: 'SET_COL_FILTER',
  filter,
  eventSource
});

export const setChangedState = (source) => ({
  type: 'SET_CHANGED_STATE',
  source
});

export const setChartFiltering = (chartFiltering) => ({
  type: 'SET_CHART_FILTERING',
  chartFiltering
});
