$ = require('jquery');
var Session = require('./session.js');

var Review = {}

Review.post = function(review_form) {
  console.log(review_form);
  var response = $.ajax({
    url: '/api/review',
    method: 'POST',
    data: {
      method: 'post_review',
      session: Session.get_session(),
      review: review_form.review,
      title: review_form.title,
      instructor_id: review_form.instructorId,
      class_id: review_form.classId,
      recommend: review_form.recommend,
    },
    dataType: 'json',
    async: false
  }).responseText;
  var data = JSON.parse(response);
  return data.Success;
}

module.exports = Review;
