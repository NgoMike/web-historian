// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var path = require('path');
var fs = require('fs');
var cron = require('cron');

//Manage list and archive updating

var job = new CronJob('*/1 * * * *', function() {

  archive.readListOfUrls((err, data) => {
    if (err) {
      throw err;
    } else {
      archive.downloadUrls(data);
    }
  });
});