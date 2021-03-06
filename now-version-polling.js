const TOKEN = '258556381:AAHNbf6mJZkahlsFPHW2pexDtsJ7saDneSc';
var TelegramBot = require('node-telegram-bot-api');
var shuffle = require('shuffle-array');
var clone = require('clone');
const options = {
  webHook: {
    // Just use 443 directly
    port: 443
  },
  polling: true
};

const url = process.env.NOW_URL;
const bot = new TelegramBot(TOKEN, options);

// This informs the Telegram servers of the new webhook.
// Note: we do not need to pass in the cert, as it already provided
bot.setWebHook(`${url}/bot${TOKEN}`);

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
  var chatId = msg.chat.id;

  previousList = clone(currentList);
  shuffle(currentList);
  updateCurrentOrder();

  bot.sendMessage(chatId, response);
});

bot.onText(/\/list/, function (msg) {
  var chatId = msg.chat.id;

  response = currentOrder;

  bot.sendMessage(chatId, response);
});

bot.onText(/\/who/, function (msg) {
  var chatId = msg.chat.id;

  var d = new Date();
  var n = d.getDay();
  if (n > 0 && n < 6) {
    response = 'SOTD - Hoje é a vez de:\n' + currentList[n - 1];
  } else {
    response = 'SOTD - Hoje é dia de descanço! :D';
  }

  bot.sendMessage(chatId, response);
});

bot.onText(/\/prev/, function (msg) {
  var chatId = msg.chat.id;

  currentList = previousList;
  updateCurrentOrder();

  bot.sendMessage(chatId, response);
});

bot.onText(/\/reset/, function (msg) {
  var chatId = msg.chat.id;

  currentList = clone(users);
  updateCurrentOrder();
  response = 'A ordem original foi reposta!';

  bot.sendMessage(chatId, response);
});

bot.onText(/\/order (.+)/, function (msg, match) {
  var chatId = msg.chat.id;

  var split = match[1].split(' ');

  if (split.length < 5)
    response = 'São necessários pelo menos 5 nomes!';
  else {
    currentList = [split[0], split[1], split[2], split[3], split[4]];
    updateCurrentOrder();
  }

  bot.sendMessage(chatId, response);
});

bot.onText(/\/help/, function (msg) {
  var chatId = msg.chat.id;

  response = 'Este é o bot da SOTD (Song Of The Day), os comandos suportados são os seguintes:\n' +
    '/shuffle - Cria uma nova listagem de pessoas para cada dia da semana\n' +
    '/prev - A lista é modificada para a lista anterior\n' +
    '/list - Apresenta a lista da semana actual\n' +
    '/who - Apresenta o responsável pela música do dia de hoje\n' +
    '/order - Permite definir uma ordem específica, seguido de 5 nomes\n' +
    '/reset - A lista é reposta para uma ordem inicial\n';

  bot.sendMessage(chatId, response);
});