/** @jsx React.DOM */

var React = require('react'),
    ReactRouter = require('react-router');

module.exports = React.createClass({
    render: function() {
        return (
            <div>
                <h1>DegreeSheep Header</h1>
                <ReactRouter.RouteHandler />
            </div>
        );
    }
});
