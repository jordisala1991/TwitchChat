function ExpressHandler() {
    this.oneDay = 86400000;
}

ExpressHandler.prototype.configure = function() {
    app.use(compression());
    app.use(serveStatic(__dirname + '/../../public', { maxAge: this.oneDay }));
    app.set('cache view');
}

module.exports = ExpressHandler;
