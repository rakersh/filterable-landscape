const source = require('js-yaml').safeLoad(require('fs').readFileSync('src/data.yml'));
const traverse = require('traverse');
const _ = require('lodash');
import parse from 'csv-parse/lib/sync';


const crunchbase = parse(require('fs').readFileSync('src/crunchbase.csv','utf-8'), {columns: true});

const tree = traverse(source);
const newSource = tree.map(function(node) {
  if (node && node.item === null) {
    const crunchbaseInfo = _.find(crunchbase, {"Organization Name URL": (node.external || {}).crunchbase});
    var crunchbaseParts = {
      market_cap: 'Not Entered Yet',
      headquarters: 'Not Entered Yet'
    };
    if (!crunchbaseInfo) {
      console.info('No crunchbase info', (node.external || {}).crunchbase, node.company, node.name);
    } else {
      const amount = crunchbaseInfo["Total Funding Amount"].substring(1).replace(/,/g, "");
      const marketCap = amount ? parseInt(amount, 10) : 'N/A';
      crunchbaseParts = {
        market_cap: marketCap,
        headquarters: crunchbaseInfo["Headquarters Location"] || 'N/A'
      }
    }
    _.assign(node, crunchbaseParts);
  }
});
var dump = require('js-yaml').dump(newSource);
dump = dump.replace(/(- \w+:) null/g, '$1');
dump = "# THIS FILE IS GENERATED AUTOMATICALLY!\n" + dump;
require('fs').writeFileSync('src/dataWithExternalInfo.yml', dump);
