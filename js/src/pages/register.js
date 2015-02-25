var React = require('react'),
    mui   = require('material-ui'),
    $     = require('jquery');

var Session = require('../util/session.js');

var ErrorBox = React.createClass({
    render: function(){
        if (this.state && this.state.failed){
             return (
                 <div className="registration-error">
                    {this.state.errmsg}
                 </div>
             );
        }
        return(<div />);
    }
});

var Register = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      username: "",
      password: "",
      email: "",
      firstname: "",
      lastname: "",
      classyear: "",
    }
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.refs.submitbutton.setState({disabled: true});
    var registration_resp = Session.register(
        this.state.username,
        this.state.password,
        this.state.email,
        this.state.firstname,
        this.state.lastname,
        this.state.classyear
    );
    if(registration_resp.Success){
      document.location.href="/#/";
    } else {
        this.refs.errorbox.setState({
            failed: true,
            errmsg: registration_resp.Error,
        });
    }
    this.refs.submitbutton.setState({disabled: false});
  },
  render: function() {
    if (Session.is_logged_in()) {
      document.location.href="/#/";
      return (<div></div>);
    } else {
      return (
        <div className="register-div">
          <h1>Sign Up!</h1>
          <form id="register-form" className="register-form" onSubmit={this.handleSubmit}>
          <table border='0'>
          <tr>
            <td>
                <mui.TextField
                     valueLink={this.linkState('username')}
                     hintText="Username"/>
            </td>
            <td>
                <mui.TextField type="password"
                     valueLink={this.linkState('password')}
                     hintText="Password"/>
            </td>
        </tr>
        <tr>
            <td>
                <mui.TextField
                     valueLink={this.linkState('firstname')}
                     hintText="First Name"/>
            </td>
            <td>
                <mui.TextField
                     valueLink={this.linkState('lastname')}
                     hintText="Last Name"/>
            </td>
        </tr>
        <tr>
            <td>
                <mui.TextField
                     valueLink={this.linkState('email')}
                     hintText="Email Address"/>
            </td>
            <td>
                <mui.TextField
                     valueLink={this.linkState('classyear')}
                     hintText="Class Year"/>
            </td>
        </tr>
        </table>
            <ErrorBox ref="errorbox" />
            <mui.RaisedButton ref="submitbutton" primary={true} label="submit"/>
          </form>
        </div>
      );
    }
  }
});

module.exports = Register;
