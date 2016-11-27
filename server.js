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
currentOrder = 'SOTD - A ordem desta semana é:\nSegunda-Feira - ' + currentList[0] + '\nTerça-Feira - ' + currentList[1] +
  '\nQuarta-Feira - ' + currentList[2] + '\nQuinta-Feira - ' + currentList[3] + '\nSexta-Feira - ' + currentList[4];

bot.onText(/\/shuffle/, function (msg) {
  var fromId = msg.from.id;

  previousList = clone(currentList);
  shuffle(currentList);
  currentOrder = 'SOTD - A ordem desta semana é:\nSegunda-Feira - ' + currentList[0] + '\nTerça-Feira - ' + currentList[1] +
    '\nQuarta-Feira - ' + currentList[2] + '\nQuinta-Feira - ' + currentList[3] + '\nSexta-Feira - ' + currentList[4];
  var resp = currentOrder;

  bot.sendMessage(fromId, resp);
});

bot.onText(/\/list/, function (msg) {
  var fromId = msg.from.id;

  var resp = currentOrder;

  bot.sendMessage(fromId, resp);
});

bot.onText(/\/reset/, function (msg) {
  var fromId = msg.from.id;

  currentList = clone(users);
  currentOrder = 'SOTD - A ordem desta semana é:\nSegunda-Feira - ' + currentList[0] + '\nTerça-Feira - ' + currentList[1] +
    '\nQuarta-Feira - ' + currentList[2] + '\nQuinta-Feira - ' + currentList[3] + '\nSexta-Feira - ' + currentList[4];
  var resp = 'A ordem original foi reposta!';

  bot.sendMessage(fromId, resp);
});