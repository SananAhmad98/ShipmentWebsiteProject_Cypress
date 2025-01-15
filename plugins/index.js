const fs = require('fs');
const path = require('path');

const { addMochaContext, mochawesome } = require('mochawesome');
const { initPlugin } = require('cypress-plugin-snapshots/plugin');

module.exports = (on, config) => {
  initPlugin(on, config);
  on('task', addMochaContext);
  on('after:run', (results) => {
    return mochawesome(results);
  });
};

module.exports = (on, config) => {
  on('task', {
    writeFile({ fileName, data }) {
      fs.writeFileSync(path.resolve(fileName), JSON.stringify(data, null, 2), 'utf8');
      return null; // Indicate that the task was successful
    }
  });
};