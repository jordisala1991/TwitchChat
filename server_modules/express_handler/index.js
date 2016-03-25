function ExpressHandler() {
    this.oneDay = 86400000;
}

ExpressHandler.prototype.configure = function() {
    app.use(compression());
    app.use(serveStatic(__dirname + '/../../public', { maxAge: this.oneDay }));

    app.engine('handlebars', exphbs({
        defaultLayout: __dirname + '/../../views/layouts/base'
    }));

    app.set('view engine', 'handlebars');
    app.set('cache view');

    app.locals.PROD_ENV = 'production' === app.settings.env;
}

ExpressHandler.prototype.homeAction = function(request, response) {
    response.render('index', {
        'clientId': configurations.environment.clientId
    });
}

module.exports = ExpressHandler;
