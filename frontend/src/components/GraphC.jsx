import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const GraphC = ({ graphData }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chart = echarts.init(chartRef.current);

        const options = {
            title: { text: 'Motion Profile', left: 'center' },
            tooltip: { trigger: 'axis' },
            toolbox: {
                    feature: {
                      saveAsImage: {}
                    }
                },
            xAxis: {
                type: 'category',
                data: graphData.xData,
                name: 'Position',
            },
            yAxis: {
                type: 'value',
                name: 'Velocity',
                min: 0,
                max: Math.max(...graphData.yData, 10), // Auto scale
            },
            series: [{
                data: graphData.yData,
                type: 'line',
                smooth: true,
                lineStyle: { width: 3 },
                symbolSize: 8,
            }],
        };

        chart.setOption(options);

        return () => chart.dispose();
    }, [graphData]);

    return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default GraphC;
