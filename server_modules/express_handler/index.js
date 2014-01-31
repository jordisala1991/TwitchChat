var ExpressHandler = function() {

}

ExpressHandler.prototype.configure = function() {
    app.set('views', __dirname + '/../../views');
    app.set('view engine', 'twig');
    app.set('twig options', { 
        strict_variables: false
    });
    app.use(express.static(__dirname + '/../../public'));
}

ExpressHandler.prototype.homeAction = function(request, response) {
    response.render('index', {
        'socketUrl': configurations.environment.baseUrl,
        'channelName': configurations.channelName
    });
}

module.exports.create = function() {
    return new ExpressHandler();
}