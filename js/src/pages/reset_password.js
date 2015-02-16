var React = require('react'),
    ReactRouter = require('react-router'),
    mui   = require('material-ui'),
    $     = require('jquery');

var Session = require('../util/session.js');

var ResetPassword = React.createClass({
  mixins: [ReactRouter.State, React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      password: "",
      password2: "",
      buttonDisabled: true,
      errorText: "",
    };
  },
  handleErrorInputChange: function(input, value) {
    if (this.state.password != this.state.password2) {
      this.setState({buttonDisabled: true,
                     errorText: "Passwords must match"});
    } else {
      this.setState({buttonDisabled: false,
                     errorText: ""});
    }
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var p = this.getParams();
    var reset_res = Session.reset(p.user, p.resetToken, this.state.password);
    if(reset_res){
      document.location.href="/#/";
    } else {
      if (!this.state.failed) {
        this.state.failed = true;
        $('#reset-form').append("<p>Unable to reset password</p>");
      }
    }
  },
  render: function() {
  return (
    <div className="reset-div">
      <h1>Reset Password</h1>
      <form id="reset-form" className="reset-password"
          onSubmit={this.handleSubmit}>
        <mui.TextField type="password"
             valueLink={this.linkState('password')}
             onChange={this.handleErrorInputChange}
             hintText="Password"/>
        <mui.TextField type="password"
             valueLink={this.linkState('password2')}
             onChange={this.handleErrorInputChange}
             hintText="Repeat password"/>
             errorText={this.state.errorText}
        <mui.RaisedButton disabled={this.state.buttonDisabled}
                          id="reset-button" primary={true} label="submit"/>
      </form>
    </div>
  );
  }
});

module.exports = ResetPassword;
