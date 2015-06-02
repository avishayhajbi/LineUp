dateHandler = {
  getTime: function(date) {
    return (date.getHours() < 10 ? "0" : "") + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  },
  getDay: function(date) {
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  },
  getTimeInMinutes: function(date) {
    return date.getHours() * 60 + date.getMinutes();
  },
  getTimeFromMinutes: function(date) {
        return (Math.floor(date/60) < 10 ? "0" : "") + Math.floor(date/60) +":"+ ((date - (Math.floor(date/60)* 60)) < 10 ? "0" : "") + (date - (Math.floor(date/60)*60));
  }
}

checkAtt = function(prop) {
  if (prop === undefined || prop === '' || prop === false || prop === 0 || prop.length === 0) {
    return false
  }
  return true;
}


var serverUrl =  "http://localHost:3030/api/";

// var serverUrl =  "http://192.168.1.17:3030/api/";
// var serverUrl =  "https://fathomless-eyrie-8332.herokuapp.com/api/";
//http://localhost:8080/auth/facebook/callback

