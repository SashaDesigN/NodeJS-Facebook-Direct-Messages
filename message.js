var debug = require('debug');
var error = debug('app:error');
var log = debug('app:log');
log.log = console.log.bind(console);

var fs = require('fs');
var request = require('request');
var conf = JSON.parse(fs.readFileSync('conf.json','utf8'));
var messages = require('./models/messages');
var users = require('./models/users');

// db
var mongoose = require('mongoose')
var Fb = require('./models/fb')
mongoose.connect('mongodb://localhost/appdb');

var login = require("facebook-chat-api");

function doAction(api){

  if(conf.sended%100 == 0){
    conf.currentUser = conf.currentUser+1;
    auth();
    return false;
  }

  Fb.findOne({"sended": {$exists: false} }).exec(function(err, item){

    // send message
    var msg = {
      body: messages.hi
    };
    // item.user_id = 100011709358615;
    api.sendMessage(msg, item.user_id, function(err, messageInfo){
      if(err){
        log(item.user_id)
        error(error);
        item.sended = false
        item.save(function(err){
          if (err) throw err;
          log('saved')
          setTimeout(function(){
            log('run next')
            doAction(api)
          },5000)
        });
        return false;
      }

      if(typeof messageInfo.messageID!='undefined'){
        log('message successfuly sended');

        // increase sended couter
        conf.sended = conf.sended+1;
        fs.writeFileSync('conf.json',JSON.stringify(conf))

        // save changes
        item.sended = true
        item.messageID = messageInfo.messageID
        item.save(function(err){
          if (err) throw err;
          log('saved')
          setTimeout(function(){
            log('run next')
            doAction(api)
          },5000)
        });
      }
    });

  });

}

function auth(){
  if(typeof users[conf.currentUser]!='undefined'){
    var account = users[conf.currentUser];
    login({
      email: account.login,
      password: account.password
    }, function callback(err, api) {
      if (err) return console.error(err);
      doAction(api);
    });
  } else {
    log('iteration completed\nwait 50 minutes for the next')
    conf.currentUser = 0
    setTimeout(function(){
      auth();
    },3000000)
  }
}

auth();
