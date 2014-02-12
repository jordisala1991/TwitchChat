module.exports = function() {
    switch(app.settings.env) {
        case 'development':
            return {
                baseUrl: 'http://localhost:5000',
                clientId: '8gsoi621f4vho16c2saw2x74v4hkdf0'
            };
        case 'production':
            return {
                baseUrl: 'http://twitch-chat.herokuapp.com',
                clientId: '1uzx8xlados5eqn7sb0pexoyuzkc1g9'
            }
        default:
            return {
                baseUrl: 'http://localhost:5000',
                clientId: '8gsoi621f4vho16c2saw2x74v4hkdf0'
            }
    }  
};