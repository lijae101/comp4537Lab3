const http = require('http');
const url = require('url');
const Utils = require('./modules/utils');
const MESSAGES = require('./lang/en/en.js');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config()

class Server {
  static start() {
    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);
      if (['/getDate/','/getDate'].indexOf(parsedUrl.pathname)>-1) {
        const name = parsedUrl.query.name || 'Guest';
        const date = Utils.getDate();
        const message = `<span style="color: blue;">${MESSAGES.greeting.replace('%1', name)} ${date}</span>`;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(message);
      } else if (['/writeFile/','/writeFile'].indexOf(parsedUrl.pathname)>-1) {
        const text = parsedUrl.query.text;
          if (text) {
            fs.appendFile('file.txt', text + '\n', (err) => {
              if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
              } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Text appended to file');
              }
            });
          } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Bad Request: No text provided');
          }
      } else if (parsedUrl.pathname === '/readFile/file.txt') {
        fs.readFile('file.txt', 'utf8', (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found: File does not exist');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
          }
      });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
    });

    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  }
}

Server.start();