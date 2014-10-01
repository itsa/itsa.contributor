/* jshint node:true*/

var root;

module.exports = function (app, prefix) {
    root = prefix;
    prefix = '/' + prefix;
    app.get(prefix, sendExample);
    app.get(prefix + '/stream', sendStream);
};


var sendExample = function (req, res) {
    var example = parseInt((req.param('example') || req.query.example || 0), 10),
        data = 'unknown example',
        contenttype = 'text/plain';
    switch (example) {
        case 1:
            data = 'This is some serverdata...';
            break;
        case 2:
            data = {age: 25};
            contenttype = 'application/json';
            break;
    }
    res.set({
          'access-control-allow-origin': '*',
          'Content-Type': contenttype
        })
       .status(200)
       .send(data);
};

var sendStream = function (req, res) {
    var example = parseInt((req.param('example') || req.query.example || 0), 10),
        block2k = '',
        j = 1,
        xdr = req.param('xdr'),
        type = req.param('type'),
        xmlHeader = '<?xml version="1.0" encoding="UTF-8" ?>',
        contenttype = 'text/plain',
        i, data, j=1;
    // Very interesting issue where we must take care with:
    // XDomainRequest only fires the `onprogress`-event when the block of code exceeds 2k !
    // see: http://blogs.msdn.com/b/ieinternals/archive/2010/04/06/comet-streaming-in-internet-explorer-with-xmlhttprequest-and-xdomainrequest.aspx
    // Thus, we prepend the response with 2k of whitespace
    if (xdr) {
        for (i=0; i<2000; i++) {
            block2k += ' ';
        }
    }
    switch (example) {
        case 1:
            contenttype = 'application/json';
            break;
        case 2:
            contenttype = 'text/xml';
            break;
    }
    res.set({
          'access-control-allow-origin': '*',
          'Content-Type': contenttype
        });
    var stream = function () {
        setTimeout(function() {
            if (j<8) {
                switch (example) {
                    case 1:
                        res.write(new Buffer(block2k+(j===1 ? '[' : '')+'{"item":'+j+'},{"item":'+(++j)+'},{"item":'+(++j)+'},'));
                        break;
                    case 2:
                        res.write(new Buffer(block2k+(j===1 ? xmlHeader+'<root>' : '')+'<item>'+j+'</item><item>'+(++j)+'</item><item>'+(++j)+'</item>'));
                        break;
                }
            }
            else {
                switch (example) {
                    case 1:
                        res.end(block2k+'{"item":'+j+'},{"item":'+(++j)+'},{"item":'+(++j)+'}]');
                        break;
                    case 2:
                        res.end(block2k+'<item>'+j+'</item><item>'+(++j)+'</item><item>'+(++j)+'</item></root>');
                        break;
                }
            }
            j++;
            if (j<12) {
                stream();
            }
        }, 500);
    };
    stream();
};