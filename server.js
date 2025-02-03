const http = require('http');
const url = require('url');
const Utils = require('./modules/utils');
const userGreeting = require('./lang/en/en.js');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config()

//Create a server class
class Server {
  static start() {
    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);
      // Check if pathname includes 'getDate'
      if (parsedUrl.pathname.includes('getDate')) {
        const name = parsedUrl.query.name || '';
        const date = Utils.getDate();
        const message = `<span style="color: blue;">${userGreeting.greeting.replace('%1', name)} ${date}</span>`;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(message);
      } 
      // Check if pathname includes 'writeFile'
      else if (parsedUrl.pathname.includes('writeFile')) {
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
      } 
      // Check if pathname starts with '/readFile/'
      else if (parsedUrl.pathname.startsWith('/readFile/')) {
        const fileName = parsedUrl.pathname.replace('/readFile/', ''); // Extract file name from URL
        fs.readFile(fileName, 'utf8', (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`404 Not Found: File "${fileName}" does not exist`);
          } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
          }
        });
      } 
      // If none of the above conditions match, return a 404
      else {
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
