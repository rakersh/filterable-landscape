import React from 'react';

import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import Subheader from 'material-ui/List/ListSubheader';
import _ from 'lodash';

const MainContent = ({groupedItems}) => {
  const itemsAndHeaders = _.map(groupedItems, function(groupedItem) {
    return [
      <GridListTile key={"subheader:" + groupedItem.header} cols={4} style={{ height: 80 }}>
          <Subheader component="div" style={{fontSize: 24}}>{groupedItem.header} ({groupedItem.items.length})</Subheader>
      </GridListTile>
    ].concat(_.map(groupedItem.items, function(item) {
      return <GridListTile key={item.path + '/' + item.name}>
            <img src={item.raw_logo} alt={item.name} />
            <GridListTileBar
              title={item.name}
              subtitle={<div><span>company: {item.company} (${item.marketCap}M)</span> | <span>stars: {item.stars}</span></div>}
            />
          </GridListTile>
    }));
  });
  return (
      <GridList cols={4} spacing={16} cellHeight={180}>
      { _.flatten(itemsAndHeaders) }
    </GridList>
  );
};

export default MainContent;
