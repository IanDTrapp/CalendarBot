var HTTPS = require('https');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/Ian$|^\/Katie$|^\/Kara$|^\/Swindon$|^\/Claire$|^\/Aaron$|^\/Daniel$|^\/Nick$|^\/Lauren$|^\/Sara$|^\/All$/;

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    var date = new Date(request.created_at * 1000);
    console.log(date);
    postMessage(request, date);
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function queryCalendar(who, date) {
  return "Sending calendar request for " + who + " at " + date;
}

function postMessage(request, date) {
  var botResponse, options, body, botReq;
  if (request.text === "/All") {
    botResponse = queryCalendar('all', date);
  }
  if (request.text === "/Ian") {
    botResponse = queryCalendar('ian', date);
  }
  if (request.text === "/Kara") {
    botResponse = queryCalendar('kara', date);
  }
  if (request.text === "/Katie") {
    botResponse = queryCalendar('katie', date);
  }
  if (request.text === "/Swindon") {
    botResponse = queryCalendar('swindon', date);
  }
  if (request.text === "/Daniel") {
    botResponse = queryCalendar('daniel', date);
  }
  if (request.text === "/Aaron") {
    botResponse = queryCalendar('aaron', date);
  }
  if (request.text === "/Claire") {
    botResponse = queryCalendar('claire', date);
  }
  if (request.text === "/Lauren") {
    botResponse = queryCalendar('lauren', date);
  }
  if (request.text === "/Sara") {
    botResponse = queryCalendar('sara', date);
  }

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;