/** @jsx React.DOM */

var React = require('react'),
    ReactRouter = require('react-router');
    mui = require('material-ui'),
    Navigation = require('react-router').Navigation;

var Session = require('../util/session.js');

var App = React.createClass({
  mixins: [Navigation],
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
      onClick=function(){this.transitionTo('Login');}.bind(this);
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
              linkButton={true} href="/#/"
              label = "Home"/>
            {/*Sheets Button*/}
            <mui.FlatButton
              linkButton={true} href="/#/sheets"
              label = "Degree Sheets"/>
          </mui.ToolbarGroup>

          <mui.ToolbarGroup key={1} float="right">
            {/*Register Button*/}
            <mui.FlatButton
            linkButton={true} href = "/#/register"
            label = "Register"
            style={registerButtonVisible ? {} : {display: 'none'}}/>
            {/*Login/Logout Button*/}
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

module.exports = App;
