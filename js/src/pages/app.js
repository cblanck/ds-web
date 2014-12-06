/** @jsx React.DOM */

var React = require('react'),
    ReactRouter = require('react-router');
    mui = require('material-ui');

var Session = require('../util/session.js');

module.exports = React.createClass({
  render: function() {
    var onClick, label;
    if (Session.is_logged_in()) {
      onClick=function(){
        Session.logout();
        location.reload();
      };
      label="Logout";
    } else {
      onClick=function(){document.location.href="/#/login"};
      label="Login";
    }
    return (
      <div>
        <mui.Toolbar>
          <mui.ToolbarGroup key={0} float="left">
            <mui.FlatButton
              onClick={function(){document.location.href="/#/"}}
              label="Home"/>
            <mui.FlatButton
              onClick={function(){document.location.href="/#/sheets"}}
              label="Degree Sheets"/>
          </mui.ToolbarGroup>
          <mui.ToolbarGroup key={1} float="right">
            <mui.FlatButton
              onClick={onClick}
              label={label} />
          </mui.ToolbarGroup>
        </mui.Toolbar>
        <ReactRouter.RouteHandler />
      </div>
    );
  }
});
