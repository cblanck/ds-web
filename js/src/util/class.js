$ = require('jquery');

var Class = {};

Class.getById = function(class_id) {
  var response = $.ajax({
    url: '/api/class',
    method: 'POST',
    data: {
      method: 'get',
      class_id: class_id
    },
    dataType: 'json',
    async: false
  }).responseText;
  var data = JSON.parse(response);
  if(data.Success){
    return data.Return;
  } else {
    return null;
  }
};


module.exports = Class;
