var HTTPS = require('https');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/Ian$|^\/Katie$|^\/Kara$|^\/Swindon$|^\/Claire$|^\/Aaron$|^\/Daniel$|^\/Nick$|^\/Lauren$|^\/Sara$|^\/All$/;

  if(request.text && botRegex.test(request.text)) {
    console.log(request);
    this.res.writeHead(200);
    postMessage(request.text);
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function queryCalendar(who) {
  return "Sending calendar request for " + who;
}

function postMessage(ping) {
  var botResponse, options, body, botReq;
  if (ping === "/All") {
    botResponse = queryCalendar('all');
  }
  if (ping === "/Ian") {
    botResponse = queryCalendar('ian');
  }
  if (ping === "/Kara") {
    botResponse = queryCalendar('kara');
  }
  if (ping === "/Katie") {
    botResponse = queryCalendar('katie');
  }
  if (ping === "/Swindon") {
    botResponse = queryCalendar('swindon');
  }
  if (ping === "/Daniel") {
    botResponse = queryCalendar('daniel');
  }
  if (ping === "/Aaron") {
    botResponse = queryCalendar('aaron');
  }
  if (ping === "/Claire") {
    botResponse = queryCalendar('claire');
  }
  if (ping === "/Lauren") {
    botResponse = queryCalendar('lauren');
  }
  if (ping === "/Sara") {
    botResponse = queryCalendar('sara');
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