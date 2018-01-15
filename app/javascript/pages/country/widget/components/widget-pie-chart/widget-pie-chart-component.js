import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import WidgetChartToolTip from 'pages/country/widget/components/widget-chart-tooltip';

import './widget-pie-chart-styles.scss';

class WidgetPieChart extends PureComponent {
  render() {
    const {
      data,
      height,
      dataKey,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      className
    } = this.props;

    return (
      <div className={`c-pie-chart ${className}`}>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={startAngle}
              endAngle={endAngle}
            >
              {data.map((item, index) => (
                <Cell key={index.toString()} fill={item.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              content={
                <WidgetChartToolTip
                  settings={[
                    {
                      key: 'percentage',
                      unit: '%',
                      label: true
                    }
                  ]}
                />
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

WidgetPieChart.propTypes = {
  data: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  dataKey: PropTypes.string,
  cx: PropTypes.number,
  cy: PropTypes.number,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  startAngle: PropTypes.number,
  endAngle: PropTypes.number,
  className: PropTypes.string
};

WidgetPieChart.defaultProps = {
  height: 300,
  dataKey: 'value',
  innerRadius: '50%',
  outerRadius: '100%',
  startAngle: 90,
  endAngle: 450
};

export default WidgetPieChart;
