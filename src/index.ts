import "dotenv/config";
import { Bot, GrammyError, HttpError } from "grammy";
import mongoose from "mongoose";
import { User } from "./models/User.js";

const bot = new Bot(process.env.BOT_API_KEY!);

// Ответ на команду /start
bot.command("start", async (ctx) => {
  if (!ctx.from) {
    return ctx.reply("User info is not available");
  }

  const { id, username, first_name } = ctx.from;

  try {
    const existingUser = await User.findOne({ telegramId: id });

    if (existingUser) {
      return ctx.reply(`Welcome back, ${first_name}`);
    }

    const newUser = new User({
      telegramId: id,
      firstName: first_name,
      username,
    });

    await newUser.save();

    return ctx.reply(`You are registered, ${first_name}`);
  } catch (error) {
    console.error("Error in start command:", error);
    ctx.reply("An error occurred while processing your request.");
  }
});

// Ответ на любое сообщение
bot.on("message:text", (ctx) => {
  ctx.reply(ctx.message.text);
});

// Обработка ошибок согласно документации
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

// Функция запуска бота
async function startBot() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    bot.start();
    console.log("MOngo & Bot started");
  } catch (error) {
    console.error("Error in startBot:", error);
  }
}

startBot();
