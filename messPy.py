#!/usr/bin/python

from facebot import Facebook
import time
import json

# connect to database
from pymongo import MongoClient
connection = MongoClient('localhost', 27017)
collection = connection.appdb.fbmarketusers

# get App config
with open('conf.json') as data_file:
    conf = json.load(data_file)

# get accounts for auth
with open('models/users.json') as data_file:
    users = json.load(data_file)

# get messages textes
with open('models/messages.json') as data_file:
    messages = json.load(data_file)

# main App class
class FacebookMessager:

    client = False

    def __init__(self):
        print "App init"
        self.auth()
        self.sendMessage()

    def auth(self):
        # check if next accout ! exists
        # and set cursor to the start of array
        if conf['currentUser'] >= len(users):
            conf['currentUser'] = 0

        user = users[conf['currentUser']]

        # make auth
        print "log in as %s \n" % user['name']
        self.client = Facebook(user['login'], user['password'])
        time.sleep( 5 )
        self.client.ping()

    def sendMessage(self):

        # switch between accounts
        if conf['sended'] % 5 == 0 :
            time.sleep(120)
            conf['currentUser'] = conf['currentUser'] + 1
            self.auth()

        # send mesage
        recipient = collection.find_one({"sended": {"$exists": False} })
        print "send %s" % recipient['user_id']
        send = self.client.send_person( recipient['user_id'], messages['joinGroup'])
        print send

        # update changes
        collection.update_one(
            {"user_id": recipient['user_id']},
            {"$set": { "sended": 1 } }
        )

        # save logs
        conf['sended'] = conf['sended'] + 1
        with open('conf.json', 'w') as outfile:
            json.dump(conf, outfile)

        time.sleep( 50 )
        self.sendMessage()


FacebookMessager = FacebookMessager()
