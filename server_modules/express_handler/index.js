function ExpressHandler() {
}

ExpressHandler.prototype.configure = function() {
    app.use(compression());
    app.use(serveStatic(__dirname + '/../../public', { maxAge: 86400000 }));
    app.set('cache view');
}

module.exports = ExpressHandler;
