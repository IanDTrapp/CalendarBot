var HTTPS = require('https');
var schedule = require('./schedule.js');
var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/Ian|^\/Katie|^\/Kara|^\/Swindon|^\/Claire$|^\/Aaron$|^\/Daniel$|^\/Nick$|^\/Lauren$|^\/Sara$|^\/All$|^\/Help$/;

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

function queryCalendar(names, day, dayText) {
  var response = '';
  console.log(names);
  for(var i = 0; i < names.length; i++) {
    var count = 0;
    var name = names[i];
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

  var day = date.getDay();
  var dayText;
  var dayArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  dayText = dayArr[day];

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
  if(reqText.toLowerCase().indexOf("=sa") > -1 || reqText.toLowerCase().indexOf("=su") > -1) {
    day = 6;
    dayText = 'Weekend';
  }

  reqText.toLowerCase();
  if (reqText.indexOf("/Ian") > -1 || reqText.indexOf("+Ian") > -1) {
    names.push("Ian");
  }
  if (reqText.indexOf('/Kara') > -1 || reqText.indexOf('+Kara') > -1) {
    names.push("Kara");
  }
  if (reqText.indexOf('/Katie') > -1 || reqText.indexOf('+Katie') > -1) {
    names.push("Katie");
  }
  if (reqText.indexOf('/Swindon') > -1 || reqText.indexOf('+Swindon') > -1) {
    names.push("Swindon");
  }
  if (reqText.indexOf('/Daniel') > -1 || reqText.indexOf('+Daniel') > -1) {
    names.push("Daniel");
  }
  if (reqText.indexOf('/Aaron') > -1 || reqText.indexOf('+Aaron') > -1) {
    names.push("Aaron");
  }
  if (reqText.indexOf('/Claire') > -1 || reqText.indexOf('+Claire') > -1) {
    names.push("Claire");
  }
  if (reqText.indexOf('/Lauren') > -1 || reqText.indexOf('+Lauren') > -1) {
    names.push("Lauren");
  }
  if (reqText.indexOf('/Sara') > -1 || reqText.indexOf('+Sara') > -1) {
    names.push("Sara");
  }
  if (reqText.indexOf('/Nick') > -1 || reqText.indexOf('+Nick') > -1) {
    names.push("Nick");
  }
  if (reqText.toLowerCase() == '/help') {
    botResponse = "Hi! I'm easy to use. \nHere are some examples of what you can do:\n/[name] would return [name]'s calendar for today\n/[name]+[name] would return both of their calendars for today\n/[name]=[day] would return [name]'s calendar for that day\n The days of the week are m t w r f";
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