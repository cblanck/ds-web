/** @jsx React.DOM */

var Session = require('../util/session.js'),
    mui = require('material-ui'),
    React = require('react');


var Home = React.createClass({
  render: function() {
    if(Session.is_logged_in()){
      return (
        <mui.Paper zdepth={1}>
          User info goes here
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
