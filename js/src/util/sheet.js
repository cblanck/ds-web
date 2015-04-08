$ = require('jquery');

var Sheet = {}

Sheet.get_template = function (template_id) {
  var response = $.ajax({
    url: '/api/degreesheet',
    method: 'POST',
    data: {
      method: 'get_requirements_for_template',
      template_id: template_id,
    },
    dataType: 'json',
    async: false,
  }).responseText;
  var data = JSON.parse(response);
  if (data.Success) {
    return data.Return;
  } else {
    return false;
  }
}

module.exports = Sheet;
