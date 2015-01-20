/**
 * @jsx React.DOM
 */
var React = require('react'),
    ReactRouter = require('react-router'),
    App = require('./pages/app.js'),
    NotFound = require('./pages/not_found.js'),
    Home = require('./pages/home.js'),
    ResetPassword = require('./pages/reset_password.js'),
    Login = require('./pages/login.js'),
    Register = require('./pages/register.js');

module.exports = (
    <ReactRouter.Route handler={App}>
        <ReactRouter.Route name="Home" path="/" handler={Home} />
        <ReactRouter.Route name="Login" path="/login" handler={Login} />
        <ReactRouter.Route name="Register" path="/register" handler={Register} />
        <ReactRouter.Route name="Reset Password" path="/reset/:user/:resetToken" handler={ResetPassword} />
        <ReactRouter.NotFoundRoute handler={NotFound} />

    </ReactRouter.Route>
);
