import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import { setColFilter } from '../actions';

class AppBar extends Component {
  constructor(props){
    super(props);
    this.handleClearFiltersClick = this.handleClearFiltersClick.bind(this);
  }
  handleClearFiltersClick(){
    const { colFilters, setColFilter } = this.props;
    let newColFilters = {}
    Object.keys(colFilters).forEach((col) => {
      newColFilters[col] = {
        ...colFilters[col],
        value: ''
      }
    });
    setColFilter(newColFilters, 'Plotly');
  }
  render(){
    return(
      <div id="AppBar">
        <div className="GraphTitle">
          {`WIES Participant Activity Distribution by Organization, Role, Type and Program`}
        </div>
        <div className="GraphFiltering">
          <div className="loading hidden" id="FilteringChart">Filtering chart</div>
          <button className="ClearFilters" onClick={this.handleClearFiltersClick}>Clear Filters</button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({colFilters, chartFiltering}) => ({
  chartFiltering,
  colFilters
});

const mapDispatchToProps = (dispatch) => ({
  setColFilter: (filter, eventSource) => { dispatch(setColFilter(filter, eventSource)) }
});



export default connect(mapStateToProps, mapDispatchToProps)(AppBar);
