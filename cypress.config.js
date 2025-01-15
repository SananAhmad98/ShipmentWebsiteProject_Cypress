const { defineConfig } = require("cypress");
const fs = require('fs');
const path = require('path');
const { json } = require("stream/consumers");

module.exports = defineConfig({
  e2e: {
    experimentalRunAllSpecs:true,// This tag is added so user can run all scripts through UI using one click
    setupNodeEvents(on, config) {
      on('task', {
        writeFile({ fileName, data}){
          fs.writeFileSync(path.resolve(fileName), JSON.stringify(data, null, 2), 'utf-8');
          return null;
        }
      });

      return config;
    },
    env: {
      URL: 'https://dev.cudacartagetms.com/log-in',
      shipment_baseURL: 'https://dev.cudacartagetms.com/shipments?filter=%255B%255D&page=1',
      routeToQuote: 'https://dev.cudacartagetms.com/admin/quotes'
    },
    reporter: 'cypress-mochawesome-reporter', // Specify the reporter
    reporterOptions: {
      reportDir: 'cypress/reports/mochawesome',
      overwrite: true,
      html: true,
      json: true
    },
  },
});
