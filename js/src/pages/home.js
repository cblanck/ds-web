/** @jsx React.DOM */

var Session = require('../util/session.js'),
    mui = require('material-ui'),
    React = require('react');


var Home = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    var session = Session.get_session();
    return {
      username: session.username,
      email: session.email,
      firstname: session.firstname,
      lastname: session.lastname,
      classyear: session.classyear,
      password: '',
      errortext: '',
    };
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var modify_res = Session.modify_user(this.state);
    if (!modify_res){
      this.setState({errortext: 'Modify failed'});
    }
  },
  render: function() {
    if(Session.is_logged_in()){
      return (
        <mui.Paper zdepth={1}>
          <strong>{this.state.username}</strong>
          <form id="user-form" className="user-form" onSubmit={this.handleSubmit}>
            <mui.TextField
                 valueLink={this.linkState('email')}
                 hintText="Email address"/>
            <mui.TextField
                 valueLink={this.linkState('password')}
                 hintText="Password"/>
            <mui.TextField
                 valueLink={this.linkState('firstname')}
                 hintText="First Name"/>
            <mui.TextField
                 valueLink={this.linkState('lastname')}
                 hintText="Last Name"/>
            <mui.TextField
                 valueLink={this.linkState('classyear')}
                 hintText="Class Year"/>
            <mui.RaisedButton primary={true} label="submit"/>
          </form>
          {this.state.errortext && <p>{this.state.errortext}</p>}
        </mui.Paper>
      );
    } else {
      return (
        <div className="home-div">
          <h1>Join the flock</h1>
          <img className="flock-image" src="../../../static/ttronslien-9405.jpg"/>
        </div>
      );
    }
  }
});

module.exports = Home;
