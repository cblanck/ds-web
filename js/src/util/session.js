$ = require('jquery');
require('jquery.cookie');

var Session = {};
var user_api = '/api/user'

Session.is_logged_in = function() {
  var session = $.cookie('session');
  if (session === undefined) {
    return false;
  }
  return session_valid(session);
};

Session.logout = function() {
  $.removeCookie('session'); 
};
Session.get_session = function() {
  return $.cookie('session');
}

Session.forgot_password = function(user) {
  $.ajax({
    url: user_api,
    method: 'POST',
    data: {
      method: 'forgot_password',
      user: user,
    },
    dataType: 'json',
  });
}

Session.reset = function(username, key, password) {
  var response = $.ajax({
    url: user_api,
    method: 'POST',
    data: {
      method: 'reset_password',
      user: username,
      reset_key: key,
      new_pass: password,
    },
    dataType: 'json',
    async: false
  }).responseText;
  var data = JSON.parse(response);
  if(data.Success){
    session_store(data.Return);
    return true;
  } else {
    return false;
  }
};

Session.login = function(username, password) {
  var response = $.ajax({
    url: user_api,
    method: 'POST',
    data: {
      method: 'login',
      user: username,
      pass: password,
    },
    dataType: 'json',
    async: false
  }).responseText;
  var data = JSON.parse(response);
  if(data.Success){
    session_store(data.Return);
    return true;
  } else {
    return false;
  }
};

Session.register = function(username, password, email, firstname, lastname, classyear) {
  var response = $.ajax({
    url: user_api,
    method: 'POST',
    data: {
      method: 'register',
      user: username,
      pass: password,
      email: email,
      firstname: firstname,
      lastname: lastname,
      classyear: classyear,
    },
    dataType: 'json',
    async: false
  }).responseText;
  var data = JSON.parse(response);
  if(data.Success){
    session_store(data.Return);
    return data;
  } else {
    return data;
  }
};

var session_store = function(json_session){
    $.cookie('username', json_session.Username);
    $.cookie('email', json_session.Email);
    $.cookie('firstname', json_session.First_name);
    $.cookie('lastname', json_session.Last_name);
    $.cookie('classyear', json_session.Class_year);
    $.cookie('session', json_session.Session_token);
};

var session_valid = function(session) {
    var validation_resp = $.ajax({
        type: 'POST',
        url: user_api,
        data: {
            method: 'validate',
            session: session
        },
        async: false
    }).responseText;
    var validation = JSON.parse(validation_resp);
    return validation.Success;
};

module.exports = Session;
