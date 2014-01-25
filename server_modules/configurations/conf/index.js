module.exports = function() {
    switch(app.settings.env) {
        case 'development':
            return {
                baseUrl: 'http://localhost'
            };
        case 'production':
            return {
                baseUrl: 'http://twitch-chat.herokuapp.com'
            }
        default:
            return {
                baseUrl: 'http://localhost'
            }
    }  
};