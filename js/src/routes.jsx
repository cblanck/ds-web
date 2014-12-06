/**
 * @jsx React.DOM
 */
var React = require('react'),
    ReactRouter = require('react-router'),
    App = require('./pages/app.js'),
    NotFound = require('./pages/not_found.js');
    Home = require('./pages/home.js'),
    Login = require('./pages/login.js');

module.exports = (
    <ReactRouter.Route handler={App}>
        <ReactRouter.Route name="Home" path="/" handler={Home} />
        <ReactRouter.Route name="Login" path="/login" handler={Login} />
        <ReactRouter.NotFoundRoute handler={NotFound} />

    </ReactRouter.Route>
);
