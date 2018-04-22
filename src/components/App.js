import { h, Component } from 'preact';

import Plotly from './Plotly';
import Table from './Table';

export default class extends Component {
  constructor(props){
    super(props);
    this.resizeGraph = this.resizeGraph.bind(this);
    this.getViewportSize = this.getViewportSize.bind(this);
    this.getContainerSize = this.getContainerSize.bind(this);
    const chartContainer = this.getContainerSize('ChartContainer');
    const tableContainer = this.getContainerSize('TableContainer');
    this.state = {
      dimensions: {
        chart: {
          ...chartContainer
        },
        table: {
          ...tableContainer
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
    if (!container){
      return this.getViewportSize();
    }
    return { w: container.offsetWidth, h: container.offsetHeight };
  }

  getViewportSize(w) {
      w = w || window;
      if (w.innerWidth != null) return { w: w.innerWidth, h: w.innerHeight };
      var d = w.document;
      if (document.compatMode == "CSS1Compat")
          return { w: d.documentElement.clientWidth,
             h: d.documentElement.clientHeight };
      return { w: d.body.clientWidth, h: d.body.clientHeight };
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
