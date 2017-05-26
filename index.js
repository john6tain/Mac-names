const http = require('http');
const url = require('url');
const path = require('path');
const qs = require('querystring');
const fs = require('fs');
const People = require('./model');
const port = process.env.PORT || 80;
const env = process.env.NODE_ENV || 'production';
const config = require('./config');
const database = require('./db.config');
database(config[env]);


http.createServer((req, res) => {
    req.pathname = req.pathname || url.parse(req.url).pathname;
    if (req.pathname === '/' && req.method === 'GET') {
        let filePath = path.normalize(path.join(__dirname, 'index.html'));
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.write('404 WTF');
                res.end();
                retrun;
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
            //console.log(qs.parse(dataString));
            People.create(qs.parse(dataString));
            res.writeHead(302, {
                'Location': '/'
            });
            res.end();
        });
    } else if (req.pathname.startsWith('/delete/') && req.method === 'GET') {
        let id = req.pathname.substring(8);
        People.findByIdAndRemove(id,(err,data)=>{
            if(err){
                console.log(err);
                return
            }
            console.log(data);
            res.writeHead(302, {
                'Location': '/'
            });
            res.end();
        })
        
    } else {
        return true;
    }

}).listen(port);
console.log("4uk")