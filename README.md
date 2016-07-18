# ![logo](http://lekeishalopez.com/wp-content/uploads/2013/01/small_Facebook-icon.png) Send Facebook Direct Messages on NodeJS with Mongoose

**Read the [facebook-chat-api](https://www.npmjs.com/package/facebook-chat-api)** docs  - my code use this module for authorize on Facebook.

### Installation

clone this repo

### Dependencies

[facebook-chat-api](https://www.npmjs.com/package/facebook-chat-api)
[mongoose](http://mongoosejs.com/)
[debug](https://www.npmjs.com/package/debug)

### App logic

This app developed to handle multiple accounts. You must add all accounts on models/users.js file.

config.json hold 2 variables, sended - count of sended messages, currentUser - cursor (index which App use to get users credentials).

This app send messages to prepeared list of users which are stored on MongoDB collection. I attach dump of databese with this collection in the 'dump' folder.

### How to run

```` DEBUG=* node message.js

### If you dont understand something

Please will free to open new issues - I'm only start develop NodeJS Apps, so can do some bugs or do some easy things in very hard way. Thanks.
