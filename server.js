var TelegramBot = require('node-telegram-bot-api');
var shuffle = require('shuffle-array');
var clone = require('clone');

var token = '258556381:AAHNbf6mJZkahlsFPHW2pexDtsJ7saDneSc';
// Setup polling way
var bot = new TelegramBot(token, {
  polling: true
});

users = ['Fernando', 'Vieira', 'Tiago', 'Caetano', 'Soraia'];
currentList = clone(users);
previousList = [];
response = '';
updateCurrentOrder();

function updateCurrentOrder() {
  currentOrder = 'SOTD - A ordem desta semana é:\nSegunda-Feira - ' + currentList[0] + '\nTerça-Feira - ' + currentList[1] +
    '\nQuarta-Feira - ' + currentList[2] + '\nQuinta-Feira - ' + currentList[3] + '\nSexta-Feira - ' + currentList[4];
  response = currentOrder;
};

bot.onText(/\/shuffle/, function (msg) {
  var fromId = msg.from.id;

  previousList = clone(currentList);
  shuffle(currentList);
  updateCurrentOrder();

  bot.sendMessage(fromId, response);
});

bot.onText(/\/list/, function (msg) {
  var fromId = msg.from.id;

  response = currentOrder;

  bot.sendMessage(fromId, response);
});

bot.onText(/\/who/, function (msg) {
  var fromId = msg.from.id;

  var d = new Date();
  var n = d.getDay();
  if (n > 0 && n < 6) {
    response = 'SOTD - Hoje é a vez de:\n' + currentList[n - 1];
  } else {
    response = 'SOTD - Hoje é dia de descanço! :D';
  }

  bot.sendMessage(fromId, response);
});

bot.onText(/\/prev/, function (msg) {
  var fromId = msg.from.id;

  currentList = previousList;
  updateCurrentOrder();

  bot.sendMessage(fromId, response);
});

bot.onText(/\/reset/, function (msg) {
  var fromId = msg.from.id;

  currentList = clone(users);
  updateCurrentOrder();
  response = 'A ordem original foi reposta!';

  bot.sendMessage(fromId, response);
});

bot.onText(/\/order (.+)/, function (msg, match) {
  var fromId = msg.from.id;

  var split = match.split(' ');

  if (split.length < 5)
    response = 'São necessários pelo menos 5 nomes!';
  else {
    currentList = [split[1], split[2], split[3], split[4], split[5]];
    updateCurrentOrder();
  }

  // send back the matched "whatever" to the chat
  bot.sendMessage(fromId, response);
});

bot.onText(/\/help/, function (msg) {
  var fromId = msg.from.id;

  response = 'Este é o bot da SOTD (Song Of The Day), os comandos suportados são os seguintes:\n' +
    '/shuffle - Cria uma nova listagem de pessoas para cada dia da semana\n' +
    '/prev - A lista é modificada para a lista anterior\n' +
    '/list - Apresenta a lista da semana actual\n' +
    '/who - Apresenta o responsável pela música do dia de hoje\n' +
    '/order - Permite definir uma ordem específica, seguido de 5 nomes\n' +
    '/reset - A lista é reposta para uma ordem inicial\n';

  bot.sendMessage(fromId, response);
});