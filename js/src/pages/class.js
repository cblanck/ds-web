/** @jsx React.DOM */

var React = require('react'),
    ReactRouter = require('react-router'),
    mui   = require('material-ui'),
    $     = require('jquery');


module.exports = React.createClass({
    mixins: [ReactRouter.State],
    render: function() {
        var uri_params = this.getParams();
        return (
                <p>Class page + {uri_params.classId} + !</p>
               );
    }
});
