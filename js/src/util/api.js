$ = require('jquery');
require('jquery.cookie');

var Api = {};

Api.call = function(api_fragment, data) {
  var response = $.ajax({
    url: api_fragment,
    method: 'POST',
    data: data,
    dataType: 'json',
    async: false,
  }).responseText;
  var resp = JSON.parse(response);
  if (resp.Success){
    return resp.Return;
  } else {
    return undefined;
  }
};

module.exports = Api;
