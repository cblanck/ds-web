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
  apiUrl: "/api/user",
  handleChange: function(input, e, value) {
    var nextState = {};
    nextState[input] = value;
    this.setState(nextState);
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
                <mui.Input type="text"
                     onChange={this.handleChange.bind(this, "username")}
                     placeholder="Username" name="username" />
            </td>
            <td>
                <mui.Input type="password"
                     onChange={this.handleChange.bind(this, "password")}
                     placeholder="Password" name="password" />
            </td>
        </tr>
        <tr>
            <td>
                <mui.Input type="text"
                     onChange={this.handleChange.bind(this, "firstname")}
                     placeholder="First Name" name="firstname" />
            </td>
            <td>
                <mui.Input type="text"
                     onChange={this.handleChange.bind(this, "lastname")}
                     placeholder="Last Name" name="lastname" />
            </td>
        </tr>
        <tr>
            <td>
                <mui.Input type="text"
                     onChange={this.handleChange.bind(this, "email")}
                     placeholder="Email Address" name="email" />
            </td>
            <td>
                <mui.Input type="text"
                     onChange={this.handleChange.bind(this, "classyear")}
                     placeholder="Class Year" name="classyear" />
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
