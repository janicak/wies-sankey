import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { setColFilter, setAppState, setChartFiltering } from '../actions';
import { matchSorter } from 'match-sorter';

import Plotly from 'plotly.js/lib/core';
import SankeyChart from 'plotly.js/lib/sankey';
import createPlotlyComponent from 'react-plotly.js/factory';

import { sankeyData } from '../data';
import { display } from '../defaultConfig';

Plotly.register([ SankeyChart ]);
const Sankey = createPlotlyComponent(Plotly);

class PlotlyChart extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleContainerClick = this.handleContainerClick.bind(this);
    let {graph} = this.props;
    this.state = graph;
  }

  componentWillReceiveProps(nextProps){
    const { eventSource, colFilters, setChartFilering } = nextProps;
    let filtersChanged = false;
    Object.keys(colFilters).forEach((col) => {
      if (!this.props.colFilters.hasOwnProperty(col) ||
        (this.props.colFilters.hasOwnProperty(col) && this.props.colFilters[col].value !== colFilters[col].value)){
        filtersChanged = true;
      }
    })
    if (filtersChanged){
      let data;
      if (eventSource === 'Table'){
        data = nextProps.selectedRows.map((row) => this.props.data[row]);
      } else if (eventSource == 'Plotly'){
        let plotlyFilters = {};
        let tableFilter = false;
        Object.keys(nextProps.colFilters).forEach((col) => {
          if (nextProps.colFilters[col].source == 'Table' && nextProps.colFilters[col].source.value ) {
            tableFilter = true;
          } else {
            plotlyFilters[col] = nextProps.colFilters[col];
          }
        });
        data = tableFilter ? nextProps.selectedRows.map((row) => this.props.data[row]) : this.props.data;
        data = data.filter((row) => {
          let matches = [];
          Object.keys(plotlyFilters).forEach((col) => {
            const value = plotlyFilters[col].value;
            let match = false;
            if (value){
              row[col].forEach((val) => {
                if (Array.isArray(val)){
                  val.forEach((subval) => {
                    if (plotlyFilters[col].value === subval){
                      match = true;
                    }
                  })
                } else {
                  if (plotlyFilters[col].value === val){
                    match = true;
                  }
                }
              })
              /*if (row[col].indexOf(value) > -1){
                matches.push(true);
              } else {
                matches.push(false);
              }*/
            } else {
              match = true;
            }
            matches.push(match);
          });
          return matches.length && matches.indexOf(false) === -1;
        });
      }
      if (data){
        const {nodes, links, /*nodesToRows,*/ customdata } = sankeyData(data, display);
        this.setState({
          ...this.state,
          data: [{
            ...this.state.data[0],
            node: {
              ...this.state.data[0].node,
              ...nodes
            },
            link: {
              ...this.state.data[0].link,
              ...links
            },
            customdata
          }]
        });
        //this.props.setAppState({nodesToRows});
      }
    }
  }

  handleClick({ points, event }){
    window.nodeClicked = true;
    window.setTimeout(() => {
      delete window.nodeClicked;
    }, 300);

    const { setChartFiltering, colFilters: currentColFilters } = this.props
    //const currentColFilters = this.props.colFilters;

    document.getElementById("FilteringChart").classList.remove("hidden");
    setChartFiltering(true);
    let selectedNodes = [];
    points.forEach((point) => {
      if (point.hasOwnProperty('sourceLinks')){
        selectedNodes.push({index: point.pointNumber, label: point.label });
      } else {
        selectedNodes = [
          ...selectedNodes,
          { index: point.source.pointNumber, label: point.source.label },
          { index: point.target.pointNumber, label: point.target.label }
        ];
      }
    });

    let newColFilters = {}
    points.forEach((point) => {
      if (point.hasOwnProperty('sourceLinks')){
        const col = point.trace.customdata[point.pointNumber]
        const label = point.label;
        if (currentColFilters.hasOwnProperty(col) && currentColFilters[col].value === label){
          // Click should toggle filter off if already on
          newColFilters[col] = {source: 'Plotly', value: ''};
        } else {
          newColFilters[col] = {source: 'Plotly', value: label};
        }
      } else {
        const sourceCol = point.trace.customdata[point.source.pointNumber];
        const sourceLabel = point.source.label;
        const targetCol = point.trace.customdata[point.target.pointNumber];
        const targetLabel = point.target.label;
        if (currentColFilters.hasOwnProperty(sourceCol) && currentColFilters.hasOwnProperty(targetCol)
          && currentColFilters[sourceCol].value === sourceLabel && currentColFilters[targetCol].value === targetLabel
        ){
          // Click should toggle filter off if already on
          newColFilters[sourceCol] = {source: 'Plotly', value: ''};
          newColFilters[targetCol] = {source: 'Plotly', value: ''};
        } else {
          newColFilters[sourceCol] = {source: 'Plotly', value: sourceLabel};
          newColFilters[targetCol] = {source: 'Plotly', value: targetLabel};
        }
      }
    });

    // Keep other previously set filters
    Object.keys(currentColFilters).forEach((col) => {
      if (!newColFilters.hasOwnProperty(col) && currentColFilters[col].value){
        newColFilters[col] = currentColFilters[col];
      }
    });

    this.props.setColFilter(newColFilters, 'Plotly');

  }

  handleContainerClick(){
    if (!window.hasOwnProperty('nodeClicked')){
      const currentColFilters = this.props.colFilters;
      let newColFilters = {};
      Object.keys(currentColFilters).forEach((col) => {
        newColFilters[col] = {source: 'Plotly', value: ''};
      })
      this.props.setColFilter(newColFilters, 'Plotly');
    }
  }

  render(){
    const {data, config, layout } = this.state;
    const { dimensions, setChartFiltering } = this.props;
    const newLayout = {
      ...layout,
      height: parseFloat(dimensions.h),
      width: parseFloat(dimensions.w)
    };



    return(
      <div className="PlotlyContainer" id="PlotlyContainer" onClick={this.handleContainerClick}>
        <Sankey
          data={data}
          layout={newLayout}
          config={config}
          onClick={this.handleClick}
          onSelected={this.handleClick}
          onAfterPlot={() => {
            document.getElementById("FilteringChart").classList.add("hidden");
          }}
        />
      </div>
    )
  }
}

const mapStateToProps = ({data, graph, colFilters, selectedRows, /*nodesToRows,*/ eventSource}) => ({
  data, graph, colFilters, selectedRows, /*nodesToRows,*/ eventSource
});

const mapDispatchToProps = (dispatch) => ({
  setColFilter: (filter, eventSource) => { dispatch(setColFilter(filter, eventSource)) },
  setAppState: (state) => { dispatch(setAppState(state)) },
  setChartFiltering: (chartFiltering) => { dispatch(setChartFiltering(chartFiltering)) }
});

export default connect(mapStateToProps, mapDispatchToProps)(PlotlyChart)
