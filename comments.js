// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var queryString = require('querystring');
var comments = require('./comments.js');

var server = http.createServer(function(request, response){
  var urlData = url.parse(request.url, true);
  var pathname = urlData.pathname;
  var query = urlData.query;
  var data = '';

  if(pathname === '/'){
    fs.readFile('index.html', function(err, data){
      if(err){
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.write('Not Found');
        response.end();
      }else{
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
      }
    });
  }else if(pathname === '/comments' && request.method === 'GET'){
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(comments.get()));
    response.end();
  }else if(pathname === '/comments' && request.method === 'POST'){
    request.on('data', function(chunk){
      data += chunk;
    });
    request.on('end', function(){
      var comment = queryString.parse(data);
      comments.add(comment);
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.write(JSON.stringify(comments.get()));
      response.end();
    });
  }else{
    response.writeHead(404, {'Content-Type': 'text/html'});
    response.write('Not Found');
    response.end();
  }
});

server.listen(3000);
console.log('Server running at http://localhost:3000/');