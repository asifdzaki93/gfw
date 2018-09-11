import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import { checkLocationInsideBbox } from 'utils/geoms';

import * as mapActions from 'components/map-v2/actions';
import ownActions from './recent-imagery-actions';

import reducers, { initialState } from './recent-imagery-reducers';
import { getRecentImageryProps } from './recent-imagery-selectors';

const actions = {
  ...ownActions,
  ...mapActions
};

const mapStateToProps = getRecentImageryProps;

class RecentImageryContainer extends PureComponent {
  componentDidMount() {
    const { active, position, dates, settings, getData } = this.props;
    if (active) {
      getData({
        ...position,
        start: dates.start,
        end: dates.end,
        bands: settings.bands
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      active,
      dataStatus,
      activeTile,
      bounds,
      sources,
      dates,
      settings,
      getData,
      getMoreTiles,
      position,
      resetRecentImageryData
    } = this.props;
    const isNewTile =
      activeTile &&
      activeTile.url &&
      (!prevProps.activeTile || activeTile.url !== prevProps.activeTile.url);
    const positionInsideTile = bounds
      ? checkLocationInsideBbox([position.lat, position.lng], bounds)
      : true;

    // get data if activated or new props
    if (
      active &&
      (active !== prevProps.active ||
        !positionInsideTile ||
        !isEqual(settings.date, prevProps.settings.date) ||
        !isEqual(settings.weeks, prevProps.settings.weeks) ||
        !isEqual(settings.bands, prevProps.settings.bands))
    ) {
      getData({
        ...position,
        start: dates.start,
        end: dates.end,
        bands: settings.bands
      });
    }

    // get the rest of the tiles
    if (
      !dataStatus.haveAllData &&
      active &&
      (isNewTile ||
        dataStatus.requestedTiles !== prevProps.dataStatus.requestedTiles ||
        dataStatus.requestFails !== prevProps.dataStatus.requestFails)
    ) {
      getMoreTiles({ sources, dataStatus, bands: settings.bands });
    }

    // if new tile update on map
    if (active && isNewTile) {
      this.setTile();
    }

    if (!active && active !== prevProps.active) {
      this.removeTile();
      resetRecentImageryData();
    }
  }

  setTile = debounce(() => {
    const {
      datasets,
      activeTile,
      setMapSettings,
      recentImageryDataset
    } = this.props;
    if (recentImageryDataset && activeTile.url) {
      const activeDatasets =
        datasets &&
        !!datasets.length &&
        datasets.filter(d => !d.isRecentImagery);
      const recentDataset = {
        dataset: recentImageryDataset.dataset,
        layers: [recentImageryDataset.layer],
        visibility: 1,
        opacity: 1,
        isRecentImagery: true,
        params: {
          url: activeTile.url
        }
      };
      setMapSettings({
        datasets: activeDatasets
          ? activeDatasets.concat(recentDataset)
          : [recentDataset]
      });
    }
  }, 200);

  removeTile() {
    const { datasets, setMapSettings } = this.props;
    const activeDatasets =
      datasets && !!datasets.length && datasets.filter(d => !d.isRecentImagery);
    setMapSettings({
      datasets: activeDatasets || []
    });
  }

  render() {
    return null;
  }
}

RecentImageryContainer.propTypes = {
  position: PropTypes.object,
  active: PropTypes.bool,
  dataStatus: PropTypes.object,
  activeTile: PropTypes.object,
  bounds: PropTypes.array,
  sources: PropTypes.array,
  dates: PropTypes.object,
  settings: PropTypes.object,
  getData: PropTypes.func,
  getMoreTiles: PropTypes.func,
  datasets: PropTypes.array,
  setMapSettings: PropTypes.func,
  recentImageryDataset: PropTypes.object,
  resetRecentImageryData: PropTypes.func
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(RecentImageryContainer);
