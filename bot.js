var HTTPS = require('https');
var schedule = require('./schedule.js');
var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]);

  if(request.text.charAt(0) == '/') {
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

function queryCalendar(names, day, dayText) {
  var response = '';
  console.log(names);
  for(var i = 0; i < names.length; i++) {
    var name = names[i];
    var count = 0;
    response += name + "'s " + dayText + " schedule\n" + "---------" + "\n";
    for(var event in schedule[name][day]) {
      event = schedule[name][day][event].name + " | " + schedule[name][day][event].time + "\n" + schedule[name][day][event].place + "\n";
      response += event;
      count++;
    }
    if(count == 0) {
      response += name + " has no events today! Lucky bastard.\n"
    }
    response += "\n";
  }
  return response;

}

function postMessage(request, date) {
  var names = [];
  var reqText = request.text.trimRight();
  var botResponse, options, body, botReq;
  reqText.toLowerCase();
  var day = date.getDay();
  var dayText;
  if(day == 1) {
    dayText = 'Monday';
  }
  if(day == 2) {
    dayText = 'Tuesday';
  }
  if(day == 3) {
    dayText = 'Wednesday';
  }
  if(day == 4) {
    dayText = 'Thursday';
  }
  if(day == 5) {
    dayText = 'Friday';
  }

  if(reqText.toLowerCase().indexOf("=m") > -1) {
    day = 1;
    dayText = 'Monday';
  }
  if(reqText.toLowerCase().indexOf("=t") > -1) {
    day = 2;
    dayText = 'Tuesday';
  }
  if(reqText.toLowerCase().indexOf("=w") > -1) {
    day = 3;
    dayText = 'Wednesday';
  }
  if(reqText.toLowerCase().indexOf("=r") > -1) {
    day = 4;
    dayText = 'Thursday';
  }
  if(reqText.toLowerCase().indexOf("=f") > -1) {
    day = 5;
    dayText = 'Friday';
  }
  reqText.toLowerCase();
  if (reqText.indexOf("/ian") > -1 || reqText.indexOf("+ian") > -1) {
    names.push("Ian");
  }
  if (reqText.indexOf('/kara') > -1 || reqText.indexOf('+kara') > -1) {
    names.push("Kara");
  }
  if (reqText.indexOf('/katie') > -1 || reqText.indexOf('+katie') > -1) {
    names.push("Katie");
  }
  if (reqText.indexOf('/swindon') > -1 || reqText.indexOf('+swindon') > -1) {
    names.push("Swindon");
  }
  if (reqText.indexOf('/daniel') > -1|| reqText.indexOf('+daniel') > -1) {
    names.push("Daniel");
  }
  if (reqText.indexOf('/aaron') > -1|| reqText.indexOf('+aaron') > -1) {
    names.push("Aaron");
  }
  if (reqText.indexOf('/claire') > -1|| reqText.indexOf('+claire') > -1) {
    names.push("Claire");
  }
  if (reqText.indexOf('/lauren') > -1|| reqText.indexOf('+lauren') > -1) {
    names.push("Lauren");
  }
  if (reqText.indexOf('/sara') > -1|| reqText.indexOf('+sara') > -1) {
    names.push("Sara");
  }
  if (reqText.indexOf('/nick') > -1|| reqText.indexOf('+nick') > -1) {
    names.push("Nick");
  }
  if (reqText.toLowerCase() == '/help') {
    botResponse = "Hi! I'm easy to use. \nHere are some examples of what you can do:\n/Ian would return Ian's calendar for today\n/Ian+Aaron would return both of their calendars for today\n/Ian=m would return his calendar for Monday\n The days of the week are m t w r f";
  }
  if (reqText.toLowerCase() !== '/help') {
    botResponse = queryCalendar(names, day, dayText);
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