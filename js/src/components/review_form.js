var React = require('react');
var Session = require('../util/session.js');
var Review = require('../util/review.js')

module.exports = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    var classId = this.props.classId;
    var instructorId = this.props.instructorId;
    return {
      review: "",
      title: "",
      recommend: 0,
      errorMessage: null,
      classId: classId,
      instructorId: instructorId,
    };
  },
  handleSubmit: function(e) {
    e.preventDefault();
    if (!this.state.errorMessage) {
      if (Session.is_logged_in()) {
        if(Review.post(this.state)) {
          this.setState({errorMessage: "Review posted!"});
        } else {
          this.setState({errorMessage: "Failed to post review"});
        }
      } else {
        this.setState({errorMessage: "You must be logged in to submit a review"});
      }
    }
  },
  render: function() {
    return (
      <div className="submit-review-div">
        <h2>Submit a review</h2>
        <form id="submit-review-form" className="submit-review-form" onSubmit={this.handleSubmit}>
          <mui.TextField
            valueLink={this.linkState('title')}
            hintText="Review Title"/>
          <mui.TextField
            valueLink={this.linkState('review')}
            hintText="Review" multiLine={true} />
          <mui.Checkbox
            name="recommend"
            label="Recommend this class?"
            onCheck={function(e, v){this.setState({recommend: +v});}.bind(this)}
            value="recommend" label="Recommend" /><br/>
          <mui.RaisedButton id="submit-review-button"
            primary={true} label="submit"/>
        </form>
        {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
      </div>
    );
  },
});


