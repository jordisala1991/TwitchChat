var ExpressHandler = function() {
    this.oneDay = 86400000;
}

ExpressHandler.prototype.configure = function() {
    app.engine('hbs', hbs.express3({
        partialsDir: __dirname + '/../../views/partials',
        defaultLayout: __dirname + '/../../views/layouts/base'
    }));
    app.locals({
        'PROD_ENV': 'production' === app.settings.env
    });

    app.use(express.compress());
    app.set('views', __dirname + '/../../views');
    app.set('view engine', 'hbs');
    app.use(express.static(__dirname + '/../../public', { maxAge: this.oneDay }));
}

ExpressHandler.prototype.homeAction = function(request, response) {
    response.render('index', {
        'baseUrl': configurations.environment.baseUrl,
        'channelName': configurations.channelName,
        'clientId': configurations.environment.clientId,
    });
}

module.exports.create = function() {
    return new ExpressHandler();
}