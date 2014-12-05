/** @jsx React.DOM */

var React = require('react'),
    ReactRouter = require('react-router');
    mui = require('material-ui');

module.exports = React.createClass({
    render: function() {
        return (
            <div>
                <mui.Toolbar>
                    <mui.ToolbarGroup key={0} float="left">
                        <mui.FlatButton onClick={function(){document.location.href="/#/"}} label="Home"/>
                        <mui.FlatButton onClick={function(){document.location.href="/#/sheets/"}} label="Degree Sheets"/>
                    </mui.ToolbarGroup>
                    <mui.ToolbarGroup key={1} float="right">
                        <mui.FlatButton href="/#/login" label="Login" />
                    </mui.ToolbarGroup>
                </mui.Toolbar>
                <ReactRouter.RouteHandler />
            </div>
        );
    }
});
