import { h, Component } from 'preact';
import { connect } from 'preact-redux'

import { setColFilter } from '../actions';

class TableFilter extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleOnInput = this.handleOnInput.bind(this);
  }

  componentWillReceiveProps(nextProps){
    const { colFilters, col } = nextProps;
    if (colFilters.hasOwnProperty(col)){
      const value = colFilters[col].value;
      this.setState({value});
    }
  }

  handleOnInput(e){
    this.setState({ value: e.target.value });
    this.props.onChange(e.target.value);
    //this.props.setColFilter({[this.props.col]: e.target.value });
  }

  render() {
    const { value } = this.state;
    return (
      <input className="colFilter" data-col={this.props.col} type="text" style="width: 100%" value={value} onInput={this.handleOnInput} />
    );
  }
}

const mapStateToProps = ({colFilters}, ...ownProps) => ({
  colFilters,
  ...ownProps
});

const mapDispatchToProps = (dispatch) => ({
  setColFilter: (filter) => { dispatch(setColFilter(filter)) }
});

export default connect(mapStateToProps, mapDispatchToProps)(TableFilter);
