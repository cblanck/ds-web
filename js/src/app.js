/**
 * @jsx React.DOM
 */
var React = require('react'),
    ReactRouter = require('react-router'),
    routes = require('./routes.jsx');

ReactRouter.run(routes, function(Handler) {
    React.render(<Handler/>, document.body);
});
