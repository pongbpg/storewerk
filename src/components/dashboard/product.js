import CanvasJSReact from '../../libs/canvasjs.react';
import React from 'react';
import Money from '../../selectors/money';
//var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var dataPoints = [];
export default class Sale extends React.Component {

    render() {
        const options = {
            // exportEnabled: true,
            theme: "light1",
            title: {
                text: "5 สินค้าขายดี"
            },
            axisX: {
                title: "",
                reversed: true,
            },
            axisY: {
                title: "Monthly Quantity",
                // labelFormatter: this.addSymbols
            },
            data: [{
                type: "bar",
                // startAngle: -90,
                dataPoints: dataPoints,
                // toolTipContent: "{label}: <strong>{y}%</strong>",
                // indexLabel: "{label}: {y}%",
                // yValueFormatString: "#,##0",
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
        dataPoints = [];
        const data = nextProps.data;
        for (var i = 0; i < data.length; i++) {
            dataPoints.push({
                label: data[i].productName,
                y: data[i].quantity,
            });
        }
        chart.render();
        // });
    }
}