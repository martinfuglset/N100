import { CSSProperties } from 'react';

export const chartConfig = {
  line: {
    margin: { top: 5, right: 20, bottom: 5, left: 0 },
    gridDash: '3 3',
    lineStyle: {
      type: 'monotone',
      stroke: '#8884d8',
      activeDot: { r: 8 },
      dot: false
    }
  },
  scatter: {
    margin: { top: 5, right: 20, bottom: 5, left: 0 },
    gridDash: '3 3',
    pointStyle: {
      fill: '#8884d8',
      line: false
    }
  },
  container: {
    width: '100%',
    height: 'calc(100vw * 9/16)',
    maxHeight: '169px'
  } as CSSProperties
};