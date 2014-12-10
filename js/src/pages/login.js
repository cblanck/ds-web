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
  handleForgot: function(e) {
    e.preventDefault();
    if (!this.state.forgot) {
      this.state.forgot = true;
      $('#login-form').append(
        <form id="forgot-form" className="forgot-form" onSubmit={this.handleForgotSubmit}>
        <mui.Input type="text"
             onChange={this.handleChange.bind(this, "forgot_user")}
             placeholder="Username" name="forgot_user" />
        <mui.RaisedButton label="submit"/>
        </form>
      );
    }
  },
  handleForgotSubmit: function(e) {
    e.preventDefault();
    $.ajax({
      url: '/api/user',
      method: 'POST',
      data: {
        method: 'forgot_password',
        user: this.state.forgot_user,
      },
      dataType: 'json',
    });
    $('#forgot-form').append("<p>Password reset has been emailed to you</p>");
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
        <mui.RaisedButton label="Forgot password" onClick={this.handleForgot}>
      );
    }
  }
});

module.exports = Login;
