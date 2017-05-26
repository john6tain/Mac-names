const People = require('../models/model');
const url = require('url');

module.exports = (req, res) => {

    req.pathname = req.pathname || url.parse(req.url).pathname;

    if (req.pathname.startsWith('/delete/') && req.method === 'GET') {
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

    } else {
        return true;
    }
}

