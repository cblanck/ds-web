//Component for listing all reviews of a given class.

var React = require('react'),
    mui   = require('material-ui'),
    $     = require('jquery');

var Review = React.createClass({

    render: function() {
        return(
                <div className="review">
                <mui.Paper zDepth={1}>
                <div className="review-title">{this.props.Title}</div>
                <div className="review-date">{this.props.Date}</div>
                <div className="review-text">{this.props.Review}</div>
                <div className="review-recommend">{this.props.Recommend.toString()}</div>
                </mui.Paper>
                </div>
              );

    },

});

var ReviewList = React.createClass({

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

        return (
                <div className="review-list-component">
                <h4>Review List</h4>
                <ul>{reviews.map(function(review, i) {
                    return (
                            <Review Title={review.Title}
                                    Date={review.Date}
                                    Review={review.Review}
                                    Recommend={review.Recommend}
                            />
                           );
                })}
                </ul>
                </div>
               );
    }
});

module.exports = ReviewList;