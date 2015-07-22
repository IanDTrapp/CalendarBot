var HTTPS = require('https');
var schedule = require('./schedule.js');
var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/Ian|^\/Katie|^\/Kara|^\/Swindon|^\/Claire$|^\/Aaron$|^\/Daniel$|^\/Nick$|^\/Lauren$|^\/Sara$|^\/All$/;

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

function queryCalendar(names, date) {
  var response = '';
  var count = 0;
  if(who === "All") {
    return "Returning calendar request for " + who + "\n" + "---------" + "\n";
  }
  for(var name in names) {
    response += "Returning calendar request for " + name + "\n" + "---------" + "\n";
    try {
      for(var event in schedule[name][date.getDay()]) {
        if(who == null) {

        }
        event = schedule[name][date.getDay()][event].name + " | " + schedule[name][date.getDay()][event].time + "\n" + schedule[name][date.getDay()][event].place + "\n";
        response += event;
        count++;
      }
    } catch (e) {
      return "Oh shit you broke me";
    }
    if(count == 0) {
      response += who + " has no events today! Lucky bastard."
    }
  }
  return response;

}

function postMessage(request, date) {
  var names = [];
  var reqText = request.text.trimRight();
  var botResponse, options, body, botReq;
  if (reqText === "/All") {
    botResponse = queryCalendar('All', date);
  }
  reqText = reqText.toString();
  if (reqText.toString().includes('/Ian') || reqText.includes('+Ian')) {
    names.push("Ian");
  }
  if (reqText.includes('/Kara') || reqText.includes('+Kara')) {
    names.push("Kara");
  }
  if (reqText.includes('/Katie') || reqText.includes('+Katie')) {
    names.push("Katie");
  }
  if (reqText.includes('/Swindon') || reqText.includes('+Swindon')) {
    names.push("Swindon");
  }
  if (reqText.includes('/Daniel') || reqText.includes('+Daniel')) {
    names.push("Daniel");
  }
  if (reqText.includes('/Aaron') || reqText.includes('+Aaron')) {
    names.push("Aaron");
  }
  if (reqText.includes('/Claire') || reqText.includes('+Claire')) {
    names.push("Claire");
  }
  if (reqText.includes('/Lauren') || reqText.includes('+Lauren')) {
    names.push("Lauren");
  }
  if (reqText.includes('/Sara') || reqText.includes('+Sara')) {
    names.push("Sara");
  }
  if (reqText.includes('/Nick') || reqText.includes('+Nick')) {
    names.push("Nick");
  }
  botResponse = queryCalendar(names, date);


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