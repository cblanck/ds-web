var React = require('react');
var Session = require('../util/session.js');
var Review = require('../util/review.js')

module.exports = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    var classId = this.props.classId;
    return {
      review: "",
      title: "",
      recommend: 0,
      errorMessage: null,
      classId: classId,
      instructorId: this.props.instructors[0].Id,
    };
  },
  dropDownChange: function(e, idx, item) {
    this.setState({instructorId: item.payload});
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
    var menuItems = this.props.instructors.map(
        function(i) {
          return {
            payload: i.Id,
            text: i.Name,
          };
        });
    return (
      <mui.Paper className="submit-review-div">
        <strong>Submit a review</strong>
        <form id="submit-review-form" className="submit-review-form" onSubmit={this.handleSubmit}>
        Which instructor did you have?
          <mui.DropDownMenu
            menuItems={menuItems}
            onChange={this.dropDownChange}/><br/>
          <mui.TextField
            valueLink={this.linkState('title')}
            hintText="Review Title"
            className="review-input-title"
            /><br/>
          <mui.TextField
            valueLink={this.linkState('review')}
            hintText="Review" className="review-input-body" multiLine={true} /><br/>
          <mui.Checkbox
            name="recommend"
            label="Recommend this class?"
            onCheck={function(e, v){this.setState({recommend: +v});}.bind(this)}
            value="recommend" label="Recommend" /><br/>
          <mui.RaisedButton id="submit-review-button"
            primary={true} label="submit"/>
        </form>
        {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
      </mui.Paper>
    );
  },
});


