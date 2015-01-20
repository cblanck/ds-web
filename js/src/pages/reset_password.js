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
    };
  },
  handleChange: function(input, e, value) {
    var nextState = this.state;
    nextState[input] = value;
    this.setState(nextState);
    if (this.state.password != this.state.password2) {
      $('#reset-button').prop("disabled", true);
      if(!$("#reset-button").hasClass("mui-is-disabled")){
        $('#reset-button').addClass("mui-is-disabled");
      }
    } else {
      $('#reset-button').prop("disabled", false);
      if($("#reset-button").hasClass("mui-is-disabled")){
        $('#reset-button').removeClass("mui-is-disabled");
      }
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
        <mui.Input type="password"
             onChange={this.handleChange.bind(this, "password")}
             placeholder="Password" name="password" />
        <mui.Input type="password"
             onChange={this.handleChange.bind(this, "password2")}
             placeholder="Repeat password" name="password2" />
        <mui.RaisedButton disabled id="reset-button" primary={true} label="submit"/>
      </form>
    </div>
  );
  }
});

module.exports = ResetPassword;
