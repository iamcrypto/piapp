
const { json } = require('body-parser');
const express = require('express');
const http = require('http');
const socket = require('socket.io');
var admin = require("firebase-admin");
const axios = require("axios")

const CURRENT_VERSION = 1;

const piNetworkApi = 'socialchain.app/v2'
const API_KEY = 'dgxxumldooihfvvtes576er2bhudyfmsmphbuax021iiolgl3sw2z9kdcomlp6tp'

const port = 80

var app = express();
const server = http.createServer(app)
const io = socket(server)
var players;
var joined = true;

var serviceAccount = require("C:/Users/HOME/Documents/cyberweb-main/nodejs.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://live-chess-dede7-default-rtdb.asia-southeast1.firebasedatabase.app"
});
app.use(express.json());
app.use(express.static(__dirname + "/"));

const database = admin.database();
const usersRef = database.ref('/users');
var games = Array(100);
for (let i = 0; i < 100; i++) {
    games[i] = {players: 0 , pid: [0 , 0]};
}


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.post('/save', (req, res) => {
    const user_id = usersRef.push().key;
    var newRef = usersRef.push({
        user_name: req.body.user_Name,
        time_span: req.body.user_time,
        c_location: req.body.user_location,
        u_date: req.body.u_date,
        u_status: req.body.user_status
    });
    var newID = newRef.key;
    res.status(200).json("Sucess");
  });
  app.get('/getusers', (req, res) => {
    jsonobj = [];
    usersRef.orderByValue().once('value', snapshot => {
      console.log(snapshot.val());
      snapshot.forEach(
        function(ChildSnapShot)
        {
            let name = ChildSnapShot.val().user_name;
            item = {}
            item ["name"] = name;
            jsonobj.push(item);
        }
      );
      res.status(200).json(jsonobj);
    }); 
  });
  app.post('/Random', (req, res) => {
    res.status(200).json(jsonobj);
  });
  app.post('/GetUser', (req, res) => {
    jsonobj = [];
    console.log(req.body.UserName);
    usersRef.orderByChild("user_name").equalTo(req.body.UserName).on('value', function (snapshot) {
      snapshot.forEach(function(ChildSnapShot) {
          let name = ChildSnapShot.val().user_name;
          let loc = ChildSnapShot.val().c_location;
          let time = ChildSnapShot.val().time_span;
          let date = ChildSnapShot.val().u_date;
          let status = ChildSnapShot.val().u_status;
          item = {}
          item ["name"] = name;
          item ["loc"] = loc;
          item ["time"] = time;
          item ["date"] = date;
          item ["status"] = status;
          jsonobj.push(item);
      });
      res.status(200).json(jsonobj);
   });
  });
const config = {headers:{'Authorization': 'Key '}}
  app.post('/approve', async (req, res) => {
    const { paymentId } = req.body
    try {
        //send /approve POST request
        await axios.post(`https://${piNetworkApi}/payments/${paymentId}/approve`, {}, {
          headers: {
            'Authorization': `Key ${API_KEY}`
          }
        })
    
        return res.status(200).send({
          message: 'Payment approved!',
          status: 'success'
        });
      } catch (err) {
        //output error for debugging
        console.log(err)
          
        //return something to your front end
        return res.status(500).send({
          message: `There has been an error!`,
          status: 'error'
        })
      }
  });
  app.post('/complete', async(req, res) => {
    const { paymentId, txid } = req.body
    try {
      //send /approve POST request
      await axios.post(`https://${piNetworkApi}/payments/${paymentId}/complete`, {
        txid
      }, {
        headers: {
          'Authorization': `Key ${API_KEY}`
        }
      })
  
      return res.status(200).send({
        message: 'Payment completed!',
        status: 'success'
      });
    } catch (err) {
      //output error for debugging
      console.log(err)
        
      //return something to your front end
      return res.status(500).send({
        message: `There has been an error!`,
        status: 'error'
      })
    }
  });
users = [];
io.on('connection', function (socket) {
    // console.log(players);
    var color;
    var colorcode;
    var playerId =  Math.floor((Math.random() * 100) + 1)
    
    console.log(playerId + ' connected');

    socket.on('joined', function (roomId) {
        // games[roomId] = {}
        if (games[roomId].players < 2) {
            games[roomId].players++;
            games[roomId].pid[games[roomId].players - 1] = playerId;
        }
        else{
            socket.emit('full', roomId)
            return;
        }
        
        console.log(games[roomId]);
        players = games[roomId].players

        if (players % 2 == 0) 
        {
            color = 'Black';
            colorcode='b';
        }
        else{
            color = 'White';
            colorcode='w';
        }

        socket.emit('player', { playerId, players, color,colorcode, roomId })
        // players--;    
    });

    socket.on('setUsername', function(data) {
        console.log(data);
        users.push(data);
        console.log(users)
        socket.emit('userSet', {username: data});
     });

     socket.on('msg', function(data) {
        //Send message to everyone
        io.sockets.emit('newmsg', data);
     });

    socket.on('move', function (msg) {
        socket.broadcast.emit('move', msg);
        // console.log(msg);
    });

    socket.on('play', function (msg) {
        //console.log(msg)
        socket.broadcast.emit('play', msg);
        var string1 = JSON.stringify(msg);
        var parsed = JSON.parse(string1); 
        console.log("ready " + parsed.roomId);      
    });

    socket.on('disconnect', function () {
        for (let i = 0; i < 100; i++) {
            if (games[i].pid[0] == playerId || games[i].pid[1] == playerId)
                games[i].players--;
        }
        console.log(playerId + ' disconnected');

    });    
});

server.listen(port);
console.log('Connected');
