var React = require('react'),
    mui   = require('material-ui'),
    $     = require('jquery');
    Navigation = require('react-router').Navigation;

var Session = require('../util/session.js');

var Login = React.createClass({
  mixins: [React.addons.LinkedStateMixin, Navigation],
  forgot: false,
  forgotSubmit: false,
  loginUrl: "/api/user",
  getInitialState: function() {
    return {
      username: "",
      password: "",
      forgot_user: "",
    };
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var login_res = Session.login(this.state.username, this.state.password);
    if(login_res){
      this.transitionTo('Home');
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
    Session.forgot_password(this.state.forgot_user);
    if (!this.forgotSubmit){
      this.forgotSubmit = true;
      $('#forgot-form').append("<p>Password reset has been emailed to you</p>");
    }
  },
  render: function() {
    if (Session.is_logged_in()) {
      this.transitionTo('Home');
      return (<div></div>);
    } else {
      return (
        <div className="login-div">
          <h1>Login</h1>
          <form id="login-form" className="login-form" onSubmit={this.handleSubmit}>
            <mui.TextField
                 valueLink={this.linkState('username')}
                 hintText="Username"/>
            <mui.TextField type="password"
                 valueLink={this.linkState('password')}
                 hintText="Password"/>
            <mui.RaisedButton id="login-button"
                 primary={true} label="submit"/>
            <mui.RaisedButton id="forgot-button" type="button"
               label="Forgot password" onClick={this.handleForgot}/>
          </form>
          <form id="forgot-form" className="forgot-form"
                onSubmit={this.handleForgotSubmit}>
          <mui.TextField
               valueLink={this.linkState('forgot_user')}
               hintText="Username"/>
          <mui.RaisedButton label="submit"/>
          </form>
        </div>
      );
    }
  }
});

module.exports = Login;
