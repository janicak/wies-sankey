import { h, Component } from "preact";
import { connect } from "preact-redux";

import { setSelectedRowsAndColFilter } from '../actions';

import ReactTable from "react-table";
import matchSorter from 'match-sorter';
import TableFilter from './TableFilter';



class Table extends Component {
  constructor(props){
    super(props);
    this.state = { defaultPageSize: 100, filtered: [] }
  }

  render(){
    const { data, setSelectedRowsAndColFilter, colFilters, dimensions } = this.props;
    const filtered = Object.keys(colFilters).length ?
      Object.keys(colFilters).map((key) => ({id: key, value: colFilters[key].value }))
      : [];

    const cellRenderer = (row) => row.value.join(', ');

    const cols = [
      { Header: "Organization Type", accessor: "Organization Type", Cell: cellRenderer, filterAll: true,
        Filter: ({filter, onChange}) => <TableFilter onChange={onChange} col="Organization Type" table={this.tableInstance} />
      },
      //{ Header: "Organization Subtype", accessor: "Organization Subtype", Cell: cellRenderer },
      { Header: "Organization Detail", accessor: "Organization Detail", Cell: cellRenderer, filterAll: true,
        Filter: ({filter, onChange}) => <TableFilter onChange={onChange} col="Organization Detail" table={this.tableInstance} />
      },
      { Header: "Role Type", accessor: "Role Type", Cell: cellRenderer, filterAll: true,
        Filter: ({filter, onChange}) => <TableFilter onChange={onChange} col="Role Type" table={this.tableInstance} />
      },
      //{ Header: "Role Subtype", accessor: "Role Subtype", Cell: cellRenderer },
      { Header: "Role Detail", accessor: "Role Detail", Cell: cellRenderer, filterAll: true,
        Filter: ({filter, onChange}) => <TableFilter onChange={onChange} col="Role Detail" table={this.tableInstance} />
      },
      { Header: "Activity Type", accessor: "Activity Type", Cell: cellRenderer, filterAll: true,
        Filter: ({filter, onChange}) => <TableFilter onChange={onChange} col="Activity Type" table={this.tableInstance} />
      },
      //{ Header: "Activity Subtype", accessor: "Activity Subtype", Cell: cellRenderer },
      { Header: "Activity Detail", accessor: "Activity Detail", Cell: cellRenderer, filterAll: true,
        Filter: ({filter, onChange}) => <TableFilter onChange={onChange} col="Activity Detail" table={this.tableInstance} />
      },
      { Header: "Focus Area", accessor: "Focus Area", Cell: cellRenderer, filterAll: true,
        Filter: ({filter, onChange}) => <TableFilter onChange={onChange} col="Focus Area" table={this.tableInstance} />
      },
      { Header: "Program", accessor: "Program", Cell: cellRenderer, filterAll: true,
        Filter: ({filter, onChange}) => <TableFilter onChange={onChange} col="Program" table={this.tableInstance} />
      },
    ];

    return(
      <ReactTable
        ref={instance => this.tableInstance = instance}
        className="-striped -highlight"
        defaultPageSize={this.state.defaultPageSize}
        pageSize={this.state.defaultPageSize}
        minRows={0}
        data={data}
        columns={cols}
        filterable
        filtered={filtered}
        style={{height: `${dimensions.h}px`}}
        defaultFilterMethod={(filter, rows) => {
          return matchSorter( rows, filter.value, { keys: [filter.id], threshold: matchSorter.rankings.CONTAINS })
        }}
        onFilteredChange={(filtered, column, filter) => {
          const selectedRows = this.tableInstance.getResolvedState().sortedData.map((d) => d._index);
          setSelectedRowsAndColFilter(selectedRows, {[column.Header]: {value: filter, source: 'Table' }}, 'Table');
        }}
      />
    )
  }
}

const mapStateToProps = ({data, colFilters}) => ({
  data, colFilters
});

const mapDispatchToProps = (dispatch) => ({
  setSelectedRowsAndColFilter: (rows, colFilter, eventSource) => { dispatch(setSelectedRowsAndColFilter(rows, colFilter, eventSource)) },
});

export default connect(mapStateToProps, mapDispatchToProps)(Table)
