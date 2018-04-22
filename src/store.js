import { createStore } from 'redux';
import csv from '../data/WIES Sankey Data - Sankey Data.csv';
import { csvArrayToObject, sankeyData } from './data';
import { display, graph } from './defaultConfig';

const data = csvArrayToObject(csv);
const {nodes, links, nodesToRows, customdata } = sankeyData(data, display);

const INITIAL = {
  data,
  nodesToRows,
  graph: graph(nodes, links, customdata),
  selectedNodes: [],
  selectedRows: [],
  colFilters: {},
  eventSource: ''
}


let ACTIONS = {
  SET_APP_STATE: (state, { newState } ) => ({
    ...state,
    ...newState,
  }),
  SET_SELECTED_NODES: (state, { nodes } ) => ({
    ...state,
    selectedNodes: nodes,
  }),
  SET_SELECTED_ROWS_AND_COL_FILTER: (state, { rows, colFilter, eventSource } ) => ({
    ...state,
    selectedRows: rows,
    colFilters: {
      ...state.colFilters,
      ...colFilter
    },
    eventSource
  }),
  SET_COL_FILTER: (state, { filter, eventSource } ) => ({
    ...state,
    colFilters: {
      ...state.colFilters,
      ...filter
    },
    eventSource
  })
}

export default createStore( (state, action) => (
	action && ACTIONS[action.type] ? ACTIONS[action.type](state, action) : state
), INITIAL, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
