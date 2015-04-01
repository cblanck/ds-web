//Component for listing all reviews of a given class.

var React = require('react'),
    mui   = require('material-ui'),
    $     = require('jquery');

var ReviewList = React.createClass({
  //  mixins: [ReactRouter.State],

    getReviewsForClass: function(classID) {
        var response = $.ajax({
            url: 'api/review',
            method: 'POST',
            data: {
                method: 'list_reviews',
                class_id: classID
            },
            dataType: 'json',
            async: false
        }).responseText;
        var data = JSON.parse(response);
        //TODO - add "if not successful" clause here.
        return data.Return;
    },

    render: function() {
        var reviews = this.getReviewsForClass(this.props.classId);
        //TODO - if no reviews, say so!
        console.log(reviews);

        return (
            <div className="review-list-component">
                <h4>Review List</h4>
                <ul>{reviews.map(function(review, i) {
                        return (
                            <div className="review-list-review">
                                <mui.Paper zDepth={1}>
                                    <div className="review-title">Title: {review.Title}</div>
                                    <div className="review-date">Date: {review.Date}</div>
                                    <div className="review-text">Review: {review.Review}</div>
                                    <div className="review-recommend"> Recommend: {review.Recommend.toString()}</div>
                                </mui.Paper>
                            </div>
                            );
                     })}
                </ul>
            </div>
        );
    }
});

module.exports = ReviewList;

