/** @jsx React.DOM */

var React = require('react'),
    ReactRouter = require('react-router');
    mui = require('material-ui');

var Session = require('../util/session.js');

module.exports = React.createClass({

  render: function() {
    var onClick, label, registerButtonVisible;

    if (Session.is_logged_in()) {
      registerButtonVisible = false;
      onClick = function(){
        Session.logout();
        location.reload();
      };
      label="Logout";
    } else {
      onClick=function(){document.location.href="/#/login"};
      label="Login";
      registerButtonVisible = true;
    }
    return (
      <div>
        {/*Header toolbar */}
        <mui.Toolbar>
          <mui.ToolbarGroup key={0} float="left">
            {/*Home Button*/}
            <mui.FlatButton
              onClick = {function(){document.location.href = "/#/"}}
              label = "Home"/>
            {/*Sheets Button*/}
            <mui.FlatButton
              onClick = {function(){document.location.href = "/#/sheets"}}
              label = "Degree Sheets"/>
          </mui.ToolbarGroup>

          <mui.ToolbarGroup key={1} float="right">
            {/*Register Button*/}
            <mui.FlatButton
            onClick = {function() {document.location.href = "/#/register"}}
            label = "Register"
            style={registerButtonVisible ? {} : {display: 'none'}}/>
            {/*Login Button*/}
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
