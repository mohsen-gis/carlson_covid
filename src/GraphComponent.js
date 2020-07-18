import React, { Component } from 'react';
import {
    BarChart, ComposedChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Bar, Cell, Line
} from 'recharts';

var _ = require('lodash')

export default class GraphComponent extends Component { 
    state = {
        aggregated: null
    }

    // get the totals for each date, all features
    getTotals = (key, data) => {
        return _.reduce(data[key], (sum, obj) => {return sum + obj.properties[this.props.fieldName]}, 0)
    }

    // get the totals for each date, only the selected features
    getSelectedTotals = (key, data, selectedGeoids) => {
        return _.reduce(data[key],
            (sum, obj) => {
                // only count if name is a selected geoid
                if (selectedGeoids.includes(obj.properties.geoid)) {
                    return sum + obj.properties[this.props.fieldName]
                }
                return sum
            }, 0)
    }

    //stateData for total since it is faster, whatever dataset is currently viewed for selected
    buildNumericalGraphData = (key, stateData, data, selectedGeoids) => {
        // create an object with date total, selected
        var entry = {date:key,
            total: this.getTotals(key, stateData)}
            if (selectedGeoids.length > 0) {
                // only add selected if there are features selected
                entry.selected = this.getSelectedTotals(key, data, selectedGeoids)
            }
        return entry
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.stateData !== this.props.stateData || prevProps.data !== this.props.data
            || prevProps.viewed !== this.props.viewed || prevProps.selected !== this.props.selected
            || prevProps.date !== this.props.date || prevProps.selectedFeatures !== this.props.selectedFeatures) {

            var aggregated = []
            var data = null
            if (this.props.type === 'numerical' && this.props.stateData != null) {

                var selectedGeoids = []
                this.props.selectedFeatures.forEach(feature => {
                    selectedGeoids.push(feature.getProperties().geoid)
                })

                data = this.props.stateData
                Object.keys(data).forEach((key) => {
                    aggregated.push(this.buildNumericalGraphData(key, this.props.stateData, this.props.data,
                        selectedGeoids))
                });

            } else if (this.props.type === 'categorical') {
                var counts = 0
                // if we have features selected use them
                if (this.props.selectedFeatures.length !== 0) {
                    // aggregate by pulling from the selected features
                    counts = _.countBy(this.props.selectedFeatures, obj => {
                        return obj.getProperties()[this.props.fieldName]
                    })
                } else if (this.props.data != null) {
                    // aggregate by all the data from that date
                    var datedData = this.props.data[this.props.date]
                    counts = _.countBy(datedData, obj => {
                        return obj.properties[this.props.fieldName]
                    })
                }
                this.props.levels.forEach(level => {
                    aggregated.push({category: level, total: counts[level] == null ? 0 : counts[level]})
                })
           
              
            }
            this.setState({aggregated: aggregated})
        }
    }

    getNumericalGraph = () => {
        return (
            //http://recharts.org/en-US/examples/BiaxialLineChart
            //TODO: better fix bug with rapidly jumping window at 1.5 aspect ratio (on my monitor)  
            // <div style={{ width: '100%', height: '100%' }}>
           <div>
            <ResponsiveContainer aspect={1}>
                <ComposedChart data={this.state.aggregated} margin={{top: 0, right: 0, left: 10, bottom: 0}}>
                    <XAxis dataKey ='date'/>
                    <YAxis yAxisId='left' />
                    <YAxis yAxisId='right' orientation='right' />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId='left' dataKey='total' name={'Total ' + this.props.fieldName} fill='#8884d8'/>
                    <Line yAxisId='right' dataKey='selected' name={'Selected ' + this.props.fieldName} stroke='#ff0000'/>
                </ComposedChart>
            </ResponsiveContainer>
            </div>
        );
    }

    getCategoricalGraph = () => {
        return (
            //TODO: better fix bug with rapidly jumping window at 1.5 aspect ratio (on my monitor)
            <ResponsiveContainer aspect={1}>
                <BarChart data={this.state.aggregated} margin={{top: 0, right: 0, left: 10, bottom: 0}}>
                    <XAxis dataKey = 'category' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='total' name={'Total ' + this.props.fieldName}>
                        {
                            // can only set colors if aggregated is set
                            this.state.aggregated != null ?
                                this.state.aggregated.map((obj, i) => {
                                  
                              
                                    // NOTE:assumes that this.state.aggregated and metadata levels are in same order
                                    // this should be the case since aggregate is set based on levels order
                                    return <Cell fill={this.props.colors[i]} />;
                                }) : null
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        );
    }

    getGraph = () => {
        return this.props.type === 'categorical' ? this.getCategoricalGraph() : this.getNumericalGraph();
    }

    render() {
        return this.getGraph()
    }
}