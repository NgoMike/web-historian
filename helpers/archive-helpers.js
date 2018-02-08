var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  // return urls in archives/sites.text
  fs.readFile(exports.paths.list, (err, data) => {
    // checking if there's an error
    if (err) {
      // if yes, throw error
      throw err;
    }
    // use template literal to convert hex code to a string, then split on '\n'
    let urls = data.toString().split('\n');
    // invoke callback on err and urls
    callback(err, urls);
  });
};

exports.isUrlInList = function(url, callback) {
  // checking if url is on the list
  fs.readFile(exports.paths.list, (err, data) => {
    // checking if there's an error
    if (err) {
      // if yes, throw error
      throw err;
    }
    // use template literal to convert hex code to a string, then split on '\n'
    let urls = data.toString().split('\n');
    // check if url is in urls array
    let bool = urls.includes(url);
    // invoke callback on err and boolean
    callback(err, bool);
  });
};

exports.addUrlToList = function(url, callback) {
  // adding a url to the list
  // check if url is in list
  this.isUrlInList(url, (err, data) => {
    // if error, throw error
    if (err) {
      throw err;
    }
    // if url is not yet in list already
    if (data === false) {
      // add url to list
      fs.writeFile(exports.paths.list, url, (err) => {
        // if error, throw error
        if (err) {
          throw err;
        }
        callback(err);
      }); 
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  // checking if url is archived
  fs.readdir(exports.paths.archivedSites, (err, data) => {
    // checking if there's an error
    if (err) {
      // if yes, throw error
      throw err;
    }
    // use template literal to convert hex code to a string, then split on '\n'
    let urls = data.toString();
    // check if url is in urls array
    let bool = urls.includes(url);
    // invoke callback on err and boolean
    callback(err, bool);
  });
};

exports.downloadUrls = function(urls) {
  // 
  for (var i = 0; i < urls.length; i++) {
    let url = urls[i];
    this.isUrlArchived(url, (err, data) => {
      if (err) {
        throw err;
      }
      if (data === false) {
        fs.writeFile(exports.paths.archivedSites, url, (err) => {
          if (err) {
            throw err;
          }
          callback(err);
        });
      }
    });
  }
};
