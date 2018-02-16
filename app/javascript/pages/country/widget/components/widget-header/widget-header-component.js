import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import isEmpty from 'lodash/isEmpty';
import { COUNTRY } from 'pages/country/router';
import { isTouch } from 'utils/browser';

import Button from 'components/button';
import Icon from 'components/icon';
import Tip from 'components/tip';
import WidgetSettings from 'pages/country/widget/components/widget-settings';

import settingsIcon from 'assets/icons/settings.svg';
import shareIcon from 'assets/icons/share.svg';
import infoIcon from 'assets/icons/info.svg';
import mapIcon from 'assets/icons/map-button.svg';
import './widget-header-styles.scss';

class WidgetHeader extends PureComponent {
  constructor() {
    super();
    this.state = {
      tooltipOpen: false
    };
  }

  render() {
    const {
      title,
      settingsConfig,
      locationNames,
      widget,
      location,
      query,
      embed,
      shareData,
      setShareModal,
      setModalMeta,
      setShowMapMobile,
      citation,
      active
    } = this.props;
    const { tooltipOpen } = this.state;
    const widgetSize = settingsConfig.config.size;
    const isDeviceTouch = isTouch();
    const haveMapLayers =
      settingsConfig.settings &&
      settingsConfig.settings.layers &&
      settingsConfig.settings.layers.length;

    return (
      <div className="c-widget-header">
        <div className="title">{`${title} in ${
          locationNames.current ? locationNames.current.label : ''
        }`}</div>
        <div className="options">
          {!embed &&
            haveMapLayers && (
              <Button
                className="map-button"
                theme={`theme-button-small ${
                  widgetSize === 'small' || isDeviceTouch ? 'square' : ''
                }`}
                link={{
                  type: COUNTRY,
                  payload: { ...location.payload },
                  query: {
                    ...query,
                    widget
                  }
                }}
                data={{
                  title: 'map-button',
                  widget: `${title} in ${
                    locationNames.current ? locationNames.current.label : ''
                  }`
                }}
                onClick={() => setShowMapMobile(true)}
                tooltip={
                  widgetSize === 'small'
                    ? {
                      theme: 'tip',
                      position: 'top',
                      arrow: true,
                      disabled: isDeviceTouch,
                      html: (
                        <Tip
                          text={
                            active ? 'Currently displayed' : 'Show on map'
                          }
                        />
                      )
                    }
                    : null
                }
              >
                {(widgetSize === 'small' || isDeviceTouch) && (
                  <Icon icon={mapIcon} className="map-icon" />
                )}
                {widgetSize !== 'small' && !isDeviceTouch && 'SHOW ON MAP'}
              </Button>
            )}
          {!embed &&
            settingsConfig &&
            !isEmpty(settingsConfig.options) && (
              <Tooltip
                theme="light"
                position="bottom-right"
                offset={-95}
                trigger="click"
                interactive
                onRequestClose={() => {
                  this.setState({ tooltipOpen: false });
                }}
                onShow={() => this.setState({ tooltipOpen: true })}
                arrow
                useContext
                open={tooltipOpen}
                html={
                  <WidgetSettings
                    {...settingsConfig}
                    widget={widget}
                    locationNames={locationNames}
                    setModalMeta={setModalMeta}
                  />
                }
              >
                <Button
                  className="theme-button-small square"
                  tooltip={{
                    theme: 'tip',
                    position: 'top',
                    arrow: true,
                    disabled: isDeviceTouch,
                    html: <Tip text="Filter and customize the data" />
                  }}
                >
                  <Icon icon={settingsIcon} className="settings-icon" />
                </Button>
              </Tooltip>
            )}
          {!embed &&
            (!isEmpty(settingsConfig.options) || haveMapLayers) && (
              <div className="separator" />
            )}
          <div className="small-options">
            <Button
              className="theme-button-small square"
              onClick={() =>
                setModalMeta(
                  settingsConfig.config.metaKey,
                  ['title', 'citation'],
                  ['function', 'source'],
                  citation
                )
              }
              tooltip={{
                theme: 'tip',
                position: 'top',
                arrow: true,
                disabled: isDeviceTouch,
                html: <Tip text="Learn more about the data" />
              }}
            >
              <Icon icon={infoIcon} />
            </Button>
            <Button
              className="theme-button-small square"
              onClick={() => setShareModal(shareData)}
              tooltip={{
                theme: 'tip',
                position: 'top',
                arrow: true,
                disabled: isDeviceTouch,
                html: <Tip text="Share or embed this widget" />
              }}
            >
              <Icon icon={shareIcon} />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

WidgetHeader.propTypes = {
  widget: PropTypes.string,
  title: PropTypes.string.isRequired,
  settingsConfig: PropTypes.object,
  locationNames: PropTypes.object,
  location: PropTypes.object,
  query: PropTypes.object,
  embed: PropTypes.bool,
  setShareModal: PropTypes.func.isRequired,
  shareData: PropTypes.object.isRequired,
  setModalMeta: PropTypes.func.isRequired,
  setShowMapMobile: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool,
  modalClosing: PropTypes.bool,
  active: PropTypes.bool,
  citation: PropTypes.string
};

export default WidgetHeader;
