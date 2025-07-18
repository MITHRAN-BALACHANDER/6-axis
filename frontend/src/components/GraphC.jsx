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
          saveAsImage: {},
        },
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
      series: [
        {
          data: graphData.yData,
          type: 'line',
          smooth: true,
          lineStyle: { width: 3 },
          symbolSize: 8,
        },
      ],
    };

    chart.setOption(options);

    // Handle resize for responsiveness
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [graphData]);

  return (
    <div 
      ref={chartRef} 
      className="w-full h-80 sm:h-96 md:h-[400px] lg:h-[450px]"
      aria-label="Motion Profile Graph"
      role="img"
    />
  );
};

export default GraphC;
