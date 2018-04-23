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

    const cellRenderer = (row) => {
      return (
        <div className="cellValueContainer" alt={row.value.join(', ')}>
          {row.value.map(v => <div className="cellValue">{v}</div>)}
        </div>
      )
    };

    const headerPrimary = (label) => (<strong>{label}</strong>);
    const headerSecondary = (label) => (<em>{label}</em>)

    const cols = [
      { Header: "Organization Type", accessor: "Organization Type", Cell: cellRenderer, filterAll: true, width: 165,
        Filter: ({filter, onChange}) => <TableFilter onChange={onChange} col="Organization Type" table={this.tableInstance} />
      },
      { Header: "Organization Detail", accessor: "Organization Detail", Cell: cellRenderer, filterAll: true,
        Filter: ({filter, onChange}) => <TableFilter onChange={onChange} col="Organization Detail" table={this.tableInstance} />
      },
      { Header: "Participant Role", accessor: "Participant Role", Cell: cellRenderer, filterAll: true, width: 155,
        Filter: ({filter, onChange}) => <TableFilter onChange={onChange} col="Participant Role" table={this.tableInstance} />
      },
      { Header: "Participant Detail", accessor: "Participant Detail", Cell: cellRenderer, filterAll: true,
        Filter: ({filter, onChange}) => <TableFilter onChange={onChange} col="Participant Detail" table={this.tableInstance} />
      },
      { Header: "Activity Type", accessor: "Activity Type", Cell: cellRenderer, filterAll: true, width: 120,
        Filter: ({filter, onChange}) => <TableFilter onChange={onChange} col="Activity Type" table={this.tableInstance} />
      },
      { Header: "Activity Detail", accessor: "Activity Detail", Cell: cellRenderer, filterAll: true,
        Filter: ({filter, onChange}) => <TableFilter onChange={onChange} col="Activity Detail" table={this.tableInstance} />
      },
      { Header: "Focus Area", accessor: "Focus Area", Cell: cellRenderer, filterAll: true, width: 190,
        Filter: ({filter, onChange}) => <TableFilter onChange={onChange} col="Focus Area" table={this.tableInstance} />
      },
      { Header: "Program", accessor: "Program", Cell: cellRenderer, filterAll: true, width: 130,
        Filter: ({filter, onChange}) => <TableFilter onChange={onChange} col="Program" table={this.tableInstance} />
      },
    ];

    return(
      <ReactTable
        ref={instance => this.tableInstance = instance}
        className="-striped -highlight"
        defaultPageSize={data.length}
        pageSize={data.length}
        showPagination={false}
        minRows={0}
        data={data}
        columns={cols}
        filterable
        filtered={filtered}
        style={{height: `${dimensions.h - 43}px`}}
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
