var HTTPS = require('https');
var schedule = require('./schedule.js');
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
  var response = "Returning calendar request for\n" + who + "\n" + date + "\n";
  for(var event in schedule[who][date.getDay()]) {
    console.log(event);
    response += event;
  }
  return response;
}

function postMessage(request, date) {
  var botResponse, options, body, botReq;
  if (request.text === "/All") {
    botResponse = queryCalendar('All', date);
  }
  if (request.text === "/Ian") {
    botResponse = queryCalendar('Ian', date);
  }
  if (request.text === "/Kara") {
    botResponse = queryCalendar('Kara', date);
  }
  if (request.text === "/Katie") {
    botResponse = queryCalendar('Katie', date);
  }
  if (request.text === "/Swindon") {
    botResponse = queryCalendar('Swindon', date);
  }
  if (request.text === "/Daniel") {
    botResponse = queryCalendar('Daniel', date);
  }
  if (request.text === "/Aaron") {
    botResponse = queryCalendar('Aaron', date);
  }
  if (request.text === "/Claire") {
    botResponse = queryCalendar('Claire', date);
  }
  if (request.text === "/Lauren") {
    botResponse = queryCalendar('Lauren', date);
  }
  if (request.text === "/Sara") {
    botResponse = queryCalendar('Sara', date);
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