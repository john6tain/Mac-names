const qs = require('querystring');
const fs = require('fs');
const url = require('url');
const path = require('path');
const People = require('../models/model');
module.exports = (req, res) => {
    req.pathname = req.pathname || url.parse(req.url).pathname;
    if (req.pathname === '/' && req.method === 'GET') {
        let filePath = path.normalize(path.join(__dirname, '../views/index.html'));
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.write('404 WTF');
                res.end();
                return;
            }

            People.find().then((people) => {
                let content = '';
                for (let person of people) {
                    content += '<tr>';
                    content += `<td>${person.name}</td>`;
                    if (person.MAC) {
                        content += `<td>${person.MAC}</td>`;
                    }
                    content += `<td><a href="/delete/${person._id}">delete</a></td>`;
                    content += '</tr>';
                }
                let html = data.toString().replace('{content}', content);
                res.writeHead(200);
                res.write(html);
                res.end();
            });


        });
    } else if (req.pathname === '/' && req.method === 'POST') {
        let dataString = '';
        req.on('data', (data) => { dataString += data });
        req.on('end', () => {
            if (dataString !== 'name=&MAC=') {
                People.create(qs.parse(dataString));
                res.writeHead(302, {
                    'Location': '/'
                });
                res.end();
            } else {
                res.writeHead(302, {
                    'Location': '/'
                });
                res.end();
            }

        });
    } else {
        return true;
    }
}