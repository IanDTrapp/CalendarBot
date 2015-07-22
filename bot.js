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
  var count = 0;
  if(who === "All") {
    return "Returning calendar request for " + who + "\n" + "---------" + "\n";
  }
  var response = "Returning calendar request for " + who + "\n" + "---------" + "\n";
  try {
    for(var event in schedule[who][date.getDay()]) {
      if(who == null) {

      }
      event = schedule[who][date.getDay()][event].name + " | " + schedule[who][date.getDay()][event].time + "\n" + schedule[who][date.getDay()][event].place + "\n";
      response += event;
      count++;
    }
  } catch (e) {
    return "Oh shit you broke me";
  }
  if(count == 0) {
    return "No events today!"
  }
  return response;
}

function postMessage(request, date) {
  var reqText = request.text.trimRight();
  var botResponse, options, body, botReq;
  if (reqText === "/All") {
    botResponse = queryCalendar('All', date);
  }
  if (reqText === "/Ian") {
    botResponse = queryCalendar('Ian', date);
  }
  if (reqText === "/Kara") {
    botResponse = queryCalendar('Kara', date);
  }
  if (reqText === "/Katie") {
    botResponse = queryCalendar('Katie', date);
  }
  if (reqText === "/Swindon") {
    botResponse = queryCalendar('Swindon', date);
  }
  if (reqText === "/Daniel") {
    botResponse = queryCalendar('Daniel', date);
  }
  if (reqText === "/Aaron") {
    botResponse = queryCalendar('Aaron', date);
  }
  if (reqText === "/Claire") {
    botResponse = queryCalendar('Claire', date);
  }
  if (reqText === "/Lauren") {
    botResponse = queryCalendar('Lauren', date);
  }
  if (reqText === "/Sara") {
    botResponse = queryCalendar('Sara', date);
  }
  if (reqText === "/Nick") {
    botResponse = queryCalendar('Nick', date);
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