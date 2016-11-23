var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var shuffle = require('shuffle-array');
var clone = require('clone');
const axios = require('axios')

users = ['Fernando', 'Vieira', 'Tiago', 'Caetano', 'Soraia'];
currentList = clone(users);
previousList = [];
currentOrder = 'SOTD - A ordem desta semana é:\nSegunda-Feira - ' + currentList[0] + '\nTerça-Feira - ' + currentList[1] +
      '\nQuarta-Feira - ' + currentList[2] + '\nQuinta-Feira - ' + currentList[3] + '\nSexta-Feira - ' + currentList[4];

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
})); // for parsing application/x-www-form-urlencoded

//This is the route the API will call
app.post('/new-message', function (req, res) {

  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id
  const {message} = req.body

  if (!message) {
    return res.end()
  }

  messageLower = message.text.toLowerCase().trim();

  if (messageLower === '/shuffle') {
    previousList = clone(currentList);
    shuffle(currentList);
    currentOrder = 'SOTD - A ordem desta semana é:\nSegunda-Feira - ' + currentList[0] + '\nTerça-Feira - ' + currentList[1] +
      '\nQuarta-Feira - ' + currentList[2] + '\nQuinta-Feira - ' + currentList[3] + '\nSexta-Feira - ' + currentList[4];
    result = currentOrder;
  }
  else if (messageLower === '/prev') {
    currentList = previousList;
    currentOrder = 'SOTD - A ordem desta semana é:\nSegunda-Feira - ' + currentList[0] + '\nTerça-Feira - ' + currentList[1] +
      '\nQuarta-Feira - ' + currentList[2] + '\nQuinta-Feira - ' + currentList[3] + '\nSexta-Feira - ' + currentList[4];
    result = currentOrder;
  }
  else if (messageLower === '/list') {
    result = currentOrder;
  }
  else if (messageLower === '/who') {
    var d = new Date();
    var n = d.getDay();
    if (n > 0 && n < 6) {
      result = 'SOTD - Hoje é a vez de:\n' + users[n - 1];
    }
    else {
      result = 'SOTD - Hoje é dia de descanço! :D';
    }
  }
  else if (messageLower === '/reset') {
    currentList = clone(users);
  }
  else if (messageLower === '/help') {
    result = 'Este é o bot da SOTD (Song Of The Day), os comandos suportados são os seguintes:\n' +
      '/shuffle - Cria uma nova listagem de pessoas para cada dia da semana\n' +
      '/list - Apresenta a lista da semana actual\n' +
      '/who - Apresenta o responsável pela música do dia de hoje\n';
  }
  else {
    return res.end()
  }

  // Remember to use your own API toked instead of the one below  "https://api.telegram.org/bot<your_api_token>/sendMessage"
  axios.post('https://api.telegram.org/bot258556381:AAHNbf6mJZkahlsFPHW2pexDtsJ7saDneSc/sendMessage', {
    chat_id: message.chat.id,
    text: result
  })
    .then(response => {
      // We get here if the message was successfully posted
      console.log('Message posted')
      res.end('ok')
    })
    .catch(err => {
      // ...and here if it was not
      console.log('Error :', err)
      res.end('Error :' + err)
    })
});

// Finally, start our server
app.listen(3000, function () {
  console.log('Telegram app listening on port 3000!');
});