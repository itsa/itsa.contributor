/* jshint node:true*/

var root;

module.exports = function (app, prefix) {
	root = prefix;
	prefix = '/' + prefix;
  app.options('*', options);
  app.get(prefix + '/status', sendStatus);
  app.get(prefix + '/action/responsetxt', sendText);
  app.get(prefix + '/action/responsexml', sendXML);
  app.get(prefix + '/action/responsedelayed', delayed);
  app.get(prefix + '/action/stream', stream);
  app.all(prefix + '/extractdata/method', returnMethod);
  app.all(prefix + '/extractdata/headers', returnHeaders);
  app.all(prefix + '/extractdata', returnRequestData);
	app.get(prefix, getRequest);
	app.post(prefix, postRequest);
	app.put(prefix, putRequest);
	app.delete(prefix, deleteRequest);
	app.all(prefix, otherRequest);

};


var options = function(req, res) {
  var requestHeaders = req.headers['access-control-request-headers'];
  res.set({
         'access-control-allow-origin': '*',
         'access-control-allow-methods': 'POST, GET, PUT, DELETE',
         'access-control-allow-headers': requestHeaders,
         'access-control-max-age': '1728000',
         'content-length': 0
     })
     .status(204)
     .send();
};

var sendStatus = function (req, res) {
  var responseHeader = req.param('res');
    res.set({
          'access-control-allow-origin': '*',
          'Content-Type': 'text/plain'
        })
       .status(responseHeader)
       .send(responseHeader);
};

var sendText = function (req, res) {
    res.set({
          'access-control-allow-origin': '*',
          'Content-Type': 'text/plain'
        })
       .status(200)
       .send('Acknowledge responsetext ok');
};

var stream = function (req, res) {
    var block2k = '',
        j = 1,
        xdr = req.param('xdr'),
        type = req.param('type'),
        xmlHeader = '<?xml version="1.0" encoding="UTF-8" ?>',
        i;
    // Very interesting issue where we must take care with:
    // XDomainRequest only fires the `onprogress`-event when the block of code exceeds 2k !
    // see: http://blogs.msdn.com/b/ieinternals/archive/2010/04/06/comet-streaming-in-internet-explorer-with-xmlhttprequest-and-xdomainrequest.aspx
    // Thus, we prepend the response with 2k of whitespace
    if (xdr) {
        for (i=0; i<2000; i++) {
            block2k += ' ';
        }
    }
    res.set({
          'access-control-allow-origin': '*',
          'Content-Type': ((type==='xml') || (type==='xmlnoblock') || (type==='xmlnostream')) ? 'text/xml' : (((type==='json') || (type==='jsonobjectnoblock') || (type==='jsonobjectnostream')) ? 'application/json' : 'text/plain')
        });
    var stream = function () {
        setTimeout(function() {
            if (j<4) {
                if (type==='jsonobject') {
                    switch (j) {
                        case 1:
                            res.write(new Buffer(block2k+'{"a":1,'));
                            break;
                        case 2:
                            res.write(new Buffer(block2k+'"b":2,'));
                            break;
                        case 3:
                            res.write(new Buffer(block2k+'"c":3,'));
                            break;
                    }
                }
                else if (type==='jsonarray') {
                    res.write(new Buffer(block2k+(j===1 ? '[' : '')+'{"a":'+j+'},'));
                }
                else if (type==='jsonobjectnoblock') {
                    switch (j) {
                        case 1:
                            res.write(new Buffer('{"a":1,'));
                            break;
                        case 2:
                            res.write(new Buffer('"b":2,'));
                            break;
                        case 3:
                            res.write(new Buffer('"c":3,'));
                            break;
                    }
                }
                else if (type==='xml') {
                    res.write(new Buffer(((j===1) ? xmlHeader+block2k+'<root>' : '')+'<response>'+j+'</response>'));
                }
                else if (type==='xmlnoblock') {
                    // res.write(new Buffer(((j===1) ? xmlHeader+block2k+'<root>' : '')+'<response>'+j+'</response>'));
                    res.write(new Buffer(((j===1) ? xmlHeader+'<root>' : '')+'<response>'+j+'</response>'));
                }
                else if (type==='noblock') {
                    res.write(new Buffer('package '+j));
                }
                else {
                    res.write(new Buffer(block2k+'package '+j));
                }
            }
            else {
                if (type==='jsonobject') {
                    res.end(block2k+'"d":4}');
                }
                else if (type==='jsonarray') {
                    res.end(block2k+'{"a":4}]');
                }
                else if (type==='jsonobjectnoblock') {
                    res.end('"d":4}');
                }
                else if (type==='xml') {
                    res.end(block2k+'<response>4</response></root>');
                }
                else if (type==='xmlnoblock') {
                    res.end('<response>4</response></root>');
                }
                else if (type==='noblock') {
                    res.end('package 4');
                }
                else {
                    res.end(block2k+'package 4');
                }
            }
            j++;
            if (j<5) {
                stream();
            }
        }, 500);
    };
    if (type==='nostream') {
        res.end('package 1package 2package 3package 4');
    }
    else if (type==='jsonobjectnostream') {
        res.end('{"a":1, "b": 2, "c": 3, "d": 4}');
    }
    else if (type==='xmlnostream') {
        res.end(xmlHeader+'<root><response>1</response><response>2</response><response>3</response><response>4</response></root>');
    }
    else {
        stream();
    }
};

var sendXML = function (req, res) {
    var xmlHeader = '<?xml version="1.0" encoding="UTF-8" ?>';
    res.set({
          'access-control-allow-origin': '*',
          'Content-Type': 'text/xml'
        })
       .status(200)
       .send(xmlHeader+'<response>10</response>');
};

var delayed = function (req, res) {
    setTimeout(function() {
      res.set({
            'access-control-allow-origin': '*',
            'Content-Type': 'text/plain'
         })
         .status(200)
         .send('Acknowledge responsetext ok');
   }, 500);
};

var getRequest = function (req, res) {
    res.set({
          'access-control-allow-origin': '*',
          'Content-Type': 'text/plain'
        })
       .status(200)
       .send('Acknowledge get-request with data: ' + req.param('data'));
};

var postRequest = function (req, res) {
    res.set({
          'access-control-allow-origin': '*',
          'Content-Type': 'text/plain'
        })
       .status(200)
       .send('Acknowledge post-request with data: ' + req.param('data'));
};

var putRequest = function (req, res) {
    res.set({
          'access-control-allow-origin': '*',
          'Content-Type': 'text/plain'
        })
       .status(200)
       .send('Acknowledge put-request with data: ' + req.param('data'));
};

var deleteRequest = function (req, res) {
    res.set({
          'access-control-allow-origin': '*',
          'Content-Type': 'text/plain'
        })
       .status(200)
       .send('Acknowledge delete-request with data: ' + req.param('data'));
};

var otherRequest = function (req, res) {
    res.set({
          'access-control-allow-origin': '*',
          'Content-Type': 'text/plain'
        })
       .status(200)
       .send('Received a generic ' + req.method + ' request with path: ' + req.path + ' and with data: ' + req.param('data'));
};

var returnMethod = function (req, res) {
    var returnObj = {};
    returnObj[req.method] = true;
    res.set({
          'access-control-allow-origin': '*',
          'Content-Type': 'application/json'
        })
       .status(200)
       .send(returnObj);
};

var returnHeaders = function (req, res) {
    res.set({
          'access-control-allow-origin': '*',
          'Content-Type': 'application/json'
        })
       .status(200)
       .send(req.headers);
};

var returnRequestData = function (req, res) {
    var delay = req.headers['x-delay'] || 0;
    setTimeout(function() {
        res.set({
              'access-control-allow-origin': '*',
              'Content-Type': 'application/json'
            })
           .status(200)
           .send(((req.method==='PUT') || (req.method==='POST')) ? req.body : req.query);
    }, delay);
};