var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!

exports.handleRequest = function (request, response) {
  // set GET method
  if (request.method === 'GET' && request.url === '/') {
    // write head {content-type: app/json}
    // read file from path to index.html
    fs.readFile(archive.paths.siteAssets + '/index.html', (err, data) => {
      // console.log("content:", data.toString());
      if (err) {
        throw err;
      }
      // write head
      response.writeHead(200, {'Content-Type': 'text/html'});
      // return html
      response.end(data);
    });
  } else if (request.method === 'GET') {
    if (request.url.charAt(0) === '/') {
      request.url = request.url.slice(1);
    }
    archive.isUrlArchived(request.url, (err, data) => {      
      if (err) {
        throw err;
      }
      if (data === false) {
        response.statusCode = 404;
        response.end();
      } else {
        console.log('request ', request.url);
        console.log('data ', data);
        fs.readdir(archive.paths.archivedSites, (err, data) => {
          if (err) {
            throw err;
          }
          response.statusCode = 200;
          response.writeHead(200, {'Content-Type': 'application/json'});
          response.end(JSON.stringify(data));
        });
      }    
    });
  } else if (request.method === 'POST') {
    // set POST method
    request.on('data', (chunk) => {
      let body = chunk.toString().slice(4) + '\n';
      archive.addUrlToList(body, (err, data) => {
        if (err) {
          throw err;
        }
        response.statusCode = 302;
        response.writeHead(302, {'Content-Type': 'application/json'});
        response.end();
      });
    });
  } else {
    response.statusCode = 404;
    response.end();
  }
};

