$ = require('jquery');
require('jquery.cookie');

var Session = {}

Session.is_logged_in = function() {                   
  var session = $.cookie('session');            
  if (session === undefined) {                  
    return false;                             
  }                                             
  return session_valid(session);                
};                                                
                       
Session.logout = function() {
  $.removeCookie('session'); 
}

Session.login = function(username, password) {
  var response = $.ajax({
    url: '/api/user',
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
    $.cookie('session', data.Return.Session_token);
    return true;
  } else {
    return false;
  } 
}

var session_valid = function(session) {           
    var validation_resp = $.ajax({                
        type: 'POST',                             
        url: '/api/user',                         
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
