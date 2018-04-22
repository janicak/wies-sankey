import { h, Component } from 'preact';
import { connect } from 'preact-redux'
import {DebounceInput} from 'react-debounce-input';

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
  }

  render() {
    const { value } = this.state;
    return (
      <DebounceInput
        className="colFilter"
        debounceTimeout={500}
        data-col={this.props.col}
        type="text"
        style="width: 100%"
        value={value}
        onChange={this.handleOnInput}
      />
    );
  }
}

const mapStateToProps = ({colFilters}, ...ownProps) => ({
  colFilters,
  ...ownProps
});

export default connect(mapStateToProps)(TableFilter);
