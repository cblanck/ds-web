/** @jsx React.DOM */

var React = require('react'),
    ReactRouter = require('react-router'),
    mui   = require('material-ui'),
    ClassAPI = require('../util/class.js'),
    $     = require('jquery');


module.exports = React.createClass({
    mixins: [ReactRouter.State],
    render: function() {
        var uri_params = this.getParams();
        var class_data = ClassAPI.getById(uri_params.classId);
        return (
                <p>{class_data}</p>
               );
    }
});
