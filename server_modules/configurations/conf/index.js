module.exports = function() {
    switch(app.settings.env) {
        case 'development':
            return {
                clientId: '8gsoi621f4vho16c2saw2x74v4hkdf0'
            };
        case 'production':
            return {
                clientId: '1uzx8xlados5eqn7sb0pexoyuzkc1g9'
            };
    }
};
