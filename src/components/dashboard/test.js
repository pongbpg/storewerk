import CanvasJSReact from '../../libs/canvasjs.react';
import React from 'react';
//var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var dataPoints = [];
export default class Test extends React.Component {

    render() {
        const options = {
            title: {
                text: "ยอดขาย มกราคม 2563"
            },
            axisY: {
                title: "Price in THB",
                prefix: "฿",
                includeZero: false
            },
            data: [{
                type: "line",
                xValueFormatString: "DD/MM/YY",
                yValueFormatString: "฿#,##0",
                dataPoints: dataPoints
            }]
        }

        return (
            <div>
                <CanvasJSChart options={options}
                    onRef={ref => this.chart = ref}
                />
            </div>
        );
    }
    componentWillReceiveProps(nextProps) {
        var chart = this.chart;
        // fetch('https://canvasjs.com/data/gallery/react/nifty-stock-price.json')
        //     .then(function (response) {
        //         return response.json();
        //     })
        //     .then(function (data) {
        const data = nextProps.data;
        for (var i = 0; i < data.length; i++) {
            dataPoints.push({
                x: new Date(data[i].orderDate),
                y: data[i].netTotal
            });
        }
        chart.render();
        // });
    }
}