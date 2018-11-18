'use strict';

//Import dependencies and set up http server
const
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json()); //express http server

//set server port and log messages on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

//endpoint for webhook
app.post('/webhook', (req, res) => {
    let body = req.body;

    //check that it's from a page subscription
    if(body.object === 'page'){
        //iterate over each entry
        body.entry.forEach(function(entry){
            //get message (array only ever has 1 item in it)
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
        });

        //return 200 to all page requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        //404 not found if not from a page subscription
        res.sendStatus(404);
    }
});

//support GET requests to webhook
app.get('/webhook', (req, res) => {
    let VERIFY_TOKEN = "laurablochverifytoken220";

    //parse query parameters
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if(mode && token){
        if(mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            //forbidden
            res.sendStatus(403);
        }
    } 
})