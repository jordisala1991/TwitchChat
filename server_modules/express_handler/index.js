var ExpressHandler = function() {
    this.oneDay = 86400000;
}

ExpressHandler.prototype.configure = function() {
    app.use(express.compress());
    app.set('views', __dirname + '/../../views');
    app.set('view engine', 'twig');
    app.set('twig options', { 
        strict_variables: false
    });
    app.use(express.static(__dirname + '/../../public', { maxAge: this.oneDay }));
}

ExpressHandler.prototype.homeAction = function(request, response) {
    response.render('index', {
        'socketUrl': configurations.environment.baseUrl,
        'channelName': configurations.channelName,
        'environment': app.settings.env
    });
}

module.exports.create = function() {
    return new ExpressHandler();
}