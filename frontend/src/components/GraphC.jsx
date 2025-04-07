import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';

const GraphC = () => {
    const [xData, setXData] = useState([0, 1, 2, 3, 4, 5]); // Default xData
    const [yData, setYData] = useState([0, 0.5, 1, 1.5, 2, 2.5]); // Default yData

    useEffect(() => {
        // Simulate fetching data from the backend
        const fetchData = async () => {
            try {
                const response = await fetch('/api/graph-data'); // Replace with your backend endpoint
                if (response.ok && response.headers.get('Content-Type')?.includes('application/json')) {
                    const data = await response.json();
                    setXData(data.xData || []);
                    setYData(data.yData || []);
                } else {
                    console.error('Unexpected response format:', response);
                }
            } catch (error) {
                console.error('Error fetching graph data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const chartContainer = document.getElementById('chart');
        if (chartContainer) {
            const chart = echarts.init(chartContainer);
            chart.setOption({
                title: {
                    text: 'Velocity',
                    left: 'center',
                },
                xAxis: {
                    type: 'category',
                    data: xData,
                    name: 'position',
                    boundaryGap: false,
                    axisLabel: {
                        interval: 0, // Show all labels
                    },
                },
                yAxis: {
                    type: 'value',
                    min: 0,
                    max: 3.5,
                    interval: 0.5,
                },
                series: [
                    {
                        data: yData,
                        type: 'line',
                        smooth: true,
                    },
                ],
            });
        }
    }, [xData, yData]);

    return <div id="chart" style={{ width: '100%', height: '400px'}}></div>;
};

export default GraphC;
