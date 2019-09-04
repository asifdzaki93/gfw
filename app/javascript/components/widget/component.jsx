import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import WidgetHeader from './components/widget-header';
import WidgetBody from './components/widget-body';
import WidgetFooter from './components/widget-footer';

import './styles.scss';

class Widget extends PureComponent {
  static propTypes = {
    widget: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    active: PropTypes.bool,
    embed: PropTypes.bool,
    large: PropTypes.bool,
    colors: PropTypes.object.isRequired,
    simple: PropTypes.bool,
    datasets: PropTypes.array,
    settings: PropTypes.object,
    options: PropTypes.array,
    chartType: PropTypes.string,
    metaKey: PropTypes.string,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    locationLabelFull: PropTypes.string,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    config: PropTypes.object,
    sentence: PropTypes.object,
    handleShowMap: PropTypes.func,
    handleShowInfo: PropTypes.func,
    handleChangeSettings: PropTypes.func,
    handleShowShare: PropTypes.func,
    parseInteraction: PropTypes.func,
    handleRefetchData: PropTypes.func,
    preventCloseSettings: PropTypes.bool,
    dataType: PropTypes.string,
    type: PropTypes.string,
    nonGlobalDatasets: PropTypes.object,
    indicator: PropTypes.object,
    forestType: PropTypes.object,
    landCategory: PropTypes.object
  };

  render() {
    const {
      title,
      widget,
      colors,
      active,
      large,
      embed,
      simple,
      datasets,
      settings,
      options,
      chartType,
      loading,
      error,
      locationLabelFull,
      data,
      config,
      sentence,
      metaKey,
      handleShowMap,
      handleShowInfo,
      handleChangeSettings,
      handleShowShare,
      handleRefetchData,
      parseInteraction,
      preventCloseSettings,
      dataType,
      type,
      nonGlobalDatasets,
      indicator,
      forestType,
      landCategory
    } = this.props;
    const { main } = colors || {};

    return (
      <div
        id={widget}
        className={cx('c-widget', { large }, { embed }, { simple })}
        style={{
          ...(active &&
            !simple &&
            !embed && {
            borderColor: main,
            boxShadow: `0 0px 0px 1px ${main}`
          })
        }}
      >
        <WidgetHeader
          widget={widget}
          title={title}
          large={large}
          datasets={datasets}
          active={active}
          embed={embed}
          options={options}
          metaKey={metaKey}
          handleShowMap={handleShowMap}
          handleShowInfo={handleShowInfo}
          handleChangeSettings={handleChangeSettings}
          handleShowShare={handleShowShare}
          preventCloseSettings={preventCloseSettings}
        />
        <WidgetBody
          chartType={chartType}
          loading={loading}
          error={error}
          simple={simple}
          locationName={locationLabelFull}
          data={data}
          settings={settings}
          sentence={sentence}
          config={config}
          handleRefetchData={handleRefetchData}
          handleChangeSettings={handleChangeSettings}
          parseInteraction={parseInteraction}
        />
        <WidgetFooter
          settings={settings}
          dataType={dataType}
          locationType={type}
          nonGlobalDatasets={nonGlobalDatasets}
          indicator={indicator}
          forestType={forestType}
          landCategory={landCategory}
          location={location}
          simple={simple}
        />
      </div>
    );
  }
}

export default Widget;
