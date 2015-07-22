var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/Ian$|^\/Katie$|^\/Kara$|^\/Swindon$|^\/Claire$|^\/Aaron$|^\/Daniel$|^\/Nick$|^\/Lauren$|^\/Sara$|^\/All$/;

  if(request.text && botRegex.test(request.text)) {
    console.log(request.text);
    this.res.writeHead(200);
    postMessage(request.text);
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(ping) {
  var botResponse, options, body, botReq;
  if (ping === "/All") {
    botResponse = 'Sending Calendar Request for All';
  }
  if (ping === "/Ian") {
    botResponse = 'Sending Calendar Request for Ian';
  }
  if (ping === "/kara") {
    botResponse = 'Sending Calendar Request for Kara';
  }
  if (ping === "/Katie") {
    botResponse = 'Sending Calendar Request for Katie';
  }
  if (ping === "/Swindon") {
    botResponse = 'Sending Calendar Request for Swindon';
  }
  if (ping === "/Daniel") {
    botResponse = 'Sending Calendar Request for Daniel';
  }
  if (ping === "/Aaron") {
    botResponse = 'Sending Calendar Request for Aaron';
  }
  if (ping === "/Claire") {
    botResponse = 'Sending Calendar Request for Claire';
  }
  if (ping === "/Lauren") {
    botResponse = 'Sending Calendar Request for Lauren';
  }
  if (ping === "/Sara") {
    botResponse = 'Sending Calendar Request for Sara';
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