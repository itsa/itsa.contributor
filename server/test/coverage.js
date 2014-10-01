/* jshint node:true */
"use strict";
var path = require('path'),
    FS = require('q-io/fs'),
    browserify = require('browserify'),
    SRC = '../src',
    root;


var list = function (req, res) {
    var testFiles = {};
    FS.listTree(SRC, function (filePath, stat) {
        if (stat.isDirectory())  {
            if (path.basename(filePath) === 'node_modules') return null;
            return false;
        }
        var parts = filePath.split('/'),
            t = parts.indexOf('tests');
        if (t !== -1) {
            var module = parts[t-1],
                file = parts[t + 1];
            if (!testFiles[module]) {
                testFiles[module] = [];
            }
            testFiles[module].push(file);
            return true;
        }
        return false;
    }).then(function (files) {
        var html = '<h2>Coverage (or <a href="/test">run tests</a>)</h2>';

        for (var m in testFiles) {
            html += '<p><a href="'+m+'">' + m + '</a></p>';
        }

        // console.log('listing test files', testFiles);

        res.send(html);
    });
};


var coverage = function (req, res, next) {
    // console.log('test:', req.params, req.query);
    var m = req.params.module,
        f = req.params.file;
    if (f) {
        FS.read(process.cwd()+'/'+SRC+'/'+m+'/coverage/lcov-report/'+m+'/'+f).then(function (content) {
            res.send(content.replace('<a href="../index.html">All files</a>', '<a href="../'+m+'">All files</a>'));
        });
    }
    else {
        res.sendfile(path.resolve(process.cwd(), path.join(SRC, m, 'coverage/lcov-report/index.html')));
    }
};


module.exports = function (app, prefix) {
    root = prefix;
    prefix = '/' + prefix;
    app.get(prefix + '/:module', coverage);
    app.get(prefix + '/:module/:file', coverage);
    app.get(prefix, list);
};