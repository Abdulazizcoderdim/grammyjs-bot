require("dotenv").config();

const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
} = require("grammy");

const bot = new Bot(process.env.BOT_API_KEY);

bot.api.setMyCommands([
  {
    command: "start",
    description: "Start the bot",
  },
  {
    command: "hello",
    description: "Hello",
  },
]);

bot.command("start", async (ctx) => {
  await ctx.react("🌚");
  await ctx.reply(
    "Hello! I am a bot. Tg <span class='tg-spoiler'>channel</span>: <a href='https://t.me/pomazkovjs'>grammyjs</a>",
    {
      parse_mode: "HTML",
    }
  );
});

bot.command("mood", async (ctx) => {
  const moodKeyboard = new Keyboard()
    .text("Good")
    .text("Bad")
    .resized()
    .oneTime();

  await ctx.reply("How are you?", {
    reply_markup: moodKeyboard,
  });
});

bot.command("share", async (ctx) => {
  const shareKeyboard = new Keyboard()
    .requestLocation("Share location")
    .requestContact("Share contact")
    .requestPoll("Share poll")
    .placeholder("Share something...")
    .resized();

  await ctx.reply("Share your contact", {
    reply_markup: shareKeyboard,
  });
});

bot.command("inline_keyboard", async (ctx) => {
  const inlineKeyboard = new InlineKeyboard()
    .text("1", "button-1")
    .text("2", "button-2")
    .text("3", "button-3");

  await ctx.reply("Inline keyboard", {
    reply_markup: inlineKeyboard,
  });
});

bot.callbackQuery(["button-1", "button-2", "button-3"], async (ctx) => {
  await ctx.answerCallbackQuery("Toast");
  await ctx.reply("Toast");
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e.message);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();
