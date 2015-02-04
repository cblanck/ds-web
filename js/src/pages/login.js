var React = require('react'),
    mui   = require('material-ui'),
    $     = require('jquery');

var Session = require('../util/session.js');

var Login = React.createClass({
  forgot: false,
  forgotSubmit: false,
  loginUrl: "/api/user",
  getInitialState: function() {
    return {
      username: "",
      password: "",
    };
  },
  handleChange: function(input, e, value) {
    var nextState = this.state;
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
    if (!this.forgot) {
      this.forgot = true;
      $('#forgot-form').slideDown();
    }
  },
  handleForgotSubmit: function(e) {
    e.preventDefault();
    $.ajax({
      url: this.loginUrl,
      method: 'POST',
      data: {
        method: 'forgot_password',
        user: this.state.forgot_user,
      },
      dataType: 'json',
    });
    if (!this.forgotSubmit){
      this.forgotSubmit = true;
      $('#forgot-form').append("<p>Password reset has been emailed to you</p>");
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
            <mui.RaisedButton id="login-button"
                 primary={true} label="submit"/>
            <mui.RaisedButton id="forgot-button" type="button"
               label="Forgot password" onClick={this.handleForgot}/>
          </form>
          <form id="forgot-form" className="forgot-form"
                onSubmit={this.handleForgotSubmit}>
          <mui.Input type="text"
               onChange={this.handleChange.bind(this, "forgot_user")}
               placeholder="Username" name="forgot_user" />
          <mui.RaisedButton label="submit"/>
          </form>
        </div>
      );
    }
  }
});

module.exports = Login;
