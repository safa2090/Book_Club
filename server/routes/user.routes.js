const UserController = require('../controllers/user.controller');
const { authenticate } = require('../config/jwt.config');


module.exports = app => {
    app.get('/api/users/',authenticate, UserController.findAll);
    app.get('/api/users/:id',authenticate, UserController.findOneUser);
    app.post('/api/users/register', UserController.register);
    app.post('/api/users/login', UserController.login);
    app.post('/api/users/logout', UserController.logout);
    app.post('/api/users/isLoggedIn', UserController.isLoggedIn);
}