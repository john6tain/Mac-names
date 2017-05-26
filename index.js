const http = require('http');
const handlers = require('./handlers/index')
const port = process.env.PORT || 80;
const env = process.env.NODE_ENV || 'production';
const config = require('./config/config');
const database = require('./config/db.config');
database(config[env]);


http
    .createServer((req, res) => {
        for (let handler of handlers) {
            if (!handler(req, res)) {
                break
            }
        }
    })
    .listen(port);
console.log("Server is running on port " + port)