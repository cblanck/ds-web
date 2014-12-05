/** @jsx React.DOM */

var React = require('react'),
    mui = require('material-ui');

module.exports = React.createClass({
    render: function() {
        return (
                <div className="page-not-found-div">
                    <span className="page-not-found-head">Not Found</span>
                    <br />
                    <span className="page-not-found-message">
                        Shepards are being called in to diagnose the problem.
                    </span>
                    <br/>
                    <div>
                        <mui.FlatButton
                            onClick={function(){document.location.href="/#/"}}
                            label="Get Me Outta Here"
                            primary={true}
                        />
                    </div>
                </div>
        );
    }
});
