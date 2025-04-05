const { json } = require('body-parser');
const express = require('express');
const http = require('http');

const axios = require("axios")

const CURRENT_VERSION = 1;

const piNetworkApi = 'socialchain.app/v2'
const API_KEY = 'dgxxumldooihfvvtes576er2bhudyfmsmphbuax021iiolgl3sw2z9kdcomlp6tp'
//0nb03vkaxhnppbb1ixdce8agzarub5fyo6i9lq984sl2hvmzzz75fpvahvrnhuvm
const port = process.env.PORT || 3000

var app = express();
const server = http.createServer(app)

app.use(express.json());
app.use(express.static(__dirname + "/"));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
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

    

server.listen(port);
console.log('Connected');