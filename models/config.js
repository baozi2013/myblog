/**
 * Created by tianhengzhou on 8/8/15.
 */
var path = require('path');
var rootPath = path.normalize(__dirname + '/../');
module.exports={
    dev: {
        cookieSecret: 'myblog',
        connectionstring: 'mongodb://zth198814:616288Xie@ds047752.mongolab.com:47752/tianhengzhou',
        rootpath:rootPath,
        port: process.env.Port || 3000
    },
    prod:{
        cookieSecret: 'myblog',
        connectionstring:'mongodb://localhost/blog',
        rootpath:rootPath,
        port: process.env.Port || 3000
    }
};
