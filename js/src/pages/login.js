var React = require('react'),
    mui   = require('material-ui'),
    $     = require('jquery');

var Session = require('../util/session.js');

var Login = React.createClass({
  loginUrl: "/api/user",
  handleChange: function(input, e, value) {
    var nextState = {};
    nextState[input] = value;
    this.setState(nextState);
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var login_res = Session.login(this.state.username, this.state.password);
    if(login_res){
      document.location.href="/#/";
    } else {
      if (!this.state.failed) {
        this.state.failed = true;
        $('#login-form').append("<p>Incorrect username or password</p>");
      }
    }
  },
  render: function() {
    if (Session.is_logged_in()) {
      document.location.href="/#/";
      return (<div></div>);
    } else {
      return (
        <div className="login-div">
          <h1>Login</h1>
          <form id="login-form" className="login-form" onSubmit={this.handleSubmit}>
            <mui.Input type="text" 
                 onChange={this.handleChange.bind(this, "username")} 
                 placeholder="Username" name="username" />
            <mui.Input type="password" 
                 onChange={this.handleChange.bind(this, "password")}
                 placeholder="Password" name="password" />
            <mui.RaisedButton primary={true} label="submit"/>
          </form>
        </div>
      );
    }
  }
});

module.exports = Login;
