const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "5312882289:AAH_tdBYbhRnD4KJC7Dm8_YGpdOuHpTY7NU";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Давай сыграем в "угадай число! Если ты угадаешь число, то я пришлю тебе еще один стикер!`
  );
  chats[chatId] = Math.floor(Math.random() * 10);
  await bot.sendMessage(chatId, "Отгадай-ка число от 0 до 9 :)", gameOptions);
};

const start = async () => {
  bot.setMyCommands([
    { command: "/start", description: "Приветствие пользователя" },
    { command: "/info", description: "Информация о пользователе" },
    { command: "/game", description: 'Игра "угадай число"' },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    console.log(chatId);
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/4.webp"
      );
      return await bot.sendMessage(chatId, `Дратути, ${msg.from.first_name}!`);
    }

    if (text === "/info") {
      return await bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name}, а никнейм твой ${msg.from.username}`
      );
    }

    if (text === "/game") {
      return startGame(chatId);
    }
    await bot.sendSticker(
      chatId,
      "https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/11.webp"
    );
    return await bot.sendMessage(
      chatId,
      `К сожалению я не знаю такой команды...`
    );
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    await bot.sendMessage(chatId, `Ты нажал ${data}!`);
    if (Number(data) === chats[chatId]) {
      await bot.sendMessage(
        chatId,
        `Это правильный ответ! Держи новый стикер!`
      );
      return await bot.sendSticker(
        chatId,
        "https://cdn.tlgrm.app/stickers/697/ba1/697ba160-9c77-3b1a-9d97-86a9ce75ff4d/192/3.webp",
        againOptions
      );
    }

    return await bot.sendMessage(
      chatId,
      `К сожалению ты не угадал, бот заказал число ${chats[chatId]}`,
      againOptions
    );
  });
};

start();
