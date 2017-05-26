const People = require('../models/model');
const url = require('url');
const path = require('path');
const fs = require('fs');
const qs = require('querystring');
const crypto = require('crypto');

module.exports = (req, res) => {

    req.pathname = req.pathname || url.parse(req.url).pathname;
    if (req.pathname.startsWith('/delete/') && req.method === 'GET') {
        let filePath = path.normalize(path.join(__dirname, '../views/login.html'));
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.write('404 WTF');
                res.end();
                return;
            }
            res.writeHead(200);
            res.write(data);
            res.end();

        });
    } else if (req.pathname.startsWith('/delete/') && req.method === 'POST') {
        let data = '';
        req.on('data', (d) => {
            data += d;
        });
        req.on('end', () => {
            data = qs.parse(data);
            let hash = crypto.createHmac('sha256', "123")
                .update(data.password).digest('hex');
            if (data.name === 'admin' && hash === '6df0b759b618276270cf3c5856d1024b11476e3ab03691a14da6340316095ae7') {
                let id = req.pathname.substring(8);
                People.findByIdAndRemove(id, (err, data) => {
                    if (err) {
                        console.log(err);
                        return
                    }
                    console.log(data);
                    res.writeHead(302, {
                        'Location': '/'
                    });
                    res.end();
                })
            }
        });


    } else {
        return true;
    }
}

