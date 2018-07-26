var path = require('path');

/**
 * Import specs
 */
var specs = '../test/specs/';
[
    'initdb',
    // 'sum',
    'endtape'
].forEach(script => {
    require(path.join(specs, script));
});