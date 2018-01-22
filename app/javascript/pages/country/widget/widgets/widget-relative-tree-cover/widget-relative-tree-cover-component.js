import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetNumberedList from 'pages/country/widget/components/widget-numbered-list';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-relative-tree-cover-styles.scss';

class WidgetRelativeTreeCover extends PureComponent {
  render() {
    const { data, settings, handlePageChange, embed, sentence } = this.props;

    return (
      <div className="c-widget-relative-tree-cover">
        <WidgetDynamicSentence sentence={sentence} />
        {data &&
          data.length > 0 && (
            <div className="locations-container">
              <WidgetNumberedList
                className="locations-list"
                data={data}
                settings={settings}
                handlePageChange={handlePageChange}
                linksDisabled={embed}
              />
            </div>
          )}
      </div>
    );
  }
}

WidgetRelativeTreeCover.propTypes = {
  data: PropTypes.array,
  settings: PropTypes.object.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  embed: PropTypes.bool,
  sentence: PropTypes.string
};

export default WidgetRelativeTreeCover;
