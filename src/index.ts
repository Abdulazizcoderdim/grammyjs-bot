import { hydrate } from "@grammyjs/hydrate";
import "dotenv/config";
import { Bot, GrammyError, HttpError, InlineKeyboard } from "grammy";
import mongoose from "mongoose";
import { payments, productsCommand, profile, start } from "./commands/index.js";
import { MyContext } from "./types.js";

const bot = new Bot<MyContext>(process.env.BOT_API_KEY!);

bot.use(hydrate());

// Ответ на команду /start
bot.command("start", start);

bot.callbackQuery("menu", (ctx) => {
  ctx.answerCallbackQuery();

  ctx.callbackQuery.message?.editText(
    "Asosiy menyuga xush kelibsiz.\nMahsulotlar bilan tanishib chiqishingiz yoki Profilingiz bilan tanishib chiqishingiz mumkin.",
    {
      reply_markup: new InlineKeyboard()
        .text("Products", "products")
        .text("Profile", "profile"),
    }
  );
});

bot.callbackQuery("products", productsCommand);

bot.callbackQuery("profile", profile);

bot.callbackQuery(/^buyProduct-\d+$/, payments);

bot.callbackQuery("backToMenu", (ctx) => {
  ctx.answerCallbackQuery();

  ctx.callbackQuery.message?.editText(
    "Asosiy menyuga xush kelibsiz.\nMahsulotlar bilan tanishib chiqishingiz yoki Profilingiz bilan tanishib chiqishingiz mumkin.",
    {
      reply_markup: new InlineKeyboard()
        .text("Products", "products")
        .text("Profile", "profile"),
    }
  );
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
