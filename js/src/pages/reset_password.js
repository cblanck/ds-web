var React = require('react'),
    ReactRouter = require('react-router'),
    mui   = require('material-ui'),
    $     = require('jquery');

var Session = require('../util/session.js');

var ResetPassword = React.createClass({
  mixins: [ReactRouter.State],
  getInitialState: function() {
    return {
      password: "",
      password2: "",
      buttonDisabled: true,
      errorText: "",
    };
  },
  handleErrorInputChange: function(input, e, value) {
    var nextState = this.state;
    nextState[input] = value;
    this.setState(nextState);
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
             onChange={this.handleErrorInputChange.bind(this, 'password')}
             hintText="Password"/>
        <mui.TextField type="password"
             onChange={this.handleErrorInputChange.bind(this, 'password2')}
             hintText="Repeat password"
             errorText={this.state.errorText}/>
        <mui.RaisedButton disabled={this.state.buttonDisabled}
                          id="reset-button" primary={true} label="submit"/>
      </form>
    </div>
  );
  }
});

module.exports = ResetPassword;
