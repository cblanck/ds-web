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

module.exports = Review;