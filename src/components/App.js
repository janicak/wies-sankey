import { h, Component } from 'preact';

import AppBar from './AppBar';
import Plotly from './Plotly';
import Table from './Table';

export default class extends Component {
  constructor(props){
    super(props);
    this.resizeGraph = this.resizeGraph.bind(this);
    this.getContainerSize = this.getContainerSize.bind(this);
    this.state = {
      dimensions: {
        chart: {
          w: 0,
          h: 0
        },
        table: {
          w: 0,
          h: 0
        }
      }
    }
  }

  resizeGraph(){
    const chartContainer = this.getContainerSize('ChartContainer');
    const tableContainer = this.getContainerSize('TableContainer');
    this.setState({
      dimensions: {
        chart: {
          ...chartContainer
        },
        table: {
          ...tableContainer
        }
      }
    });
  }

  getContainerSize(id) {
    const container = document.getElementById(id);
    return { w: container.offsetWidth, h: container.offsetHeight };
  }

  componentDidMount(){
    window.addEventListener('resize', this.resizeGraph);
    this.resizeGraph();
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.resizeGraph);
  }

  render(){
    return(
      <div className="App">
        <AppBar />
        <div id="ChartContainer">
          <Plotly dimensions={this.state.dimensions.chart} />
        </div>
        <div id="TableContainer" >
          <Table dimensions={this.state.dimensions.table} />
        </div>
      </div>
    )
  }
}
