import { CallbackQueryContext, InlineKeyboard } from "grammy";
import { User } from "../models/User.js";
import { MyContext } from "../types.js";

export const profile = async (ctx: CallbackQueryContext<MyContext>) => {
  ctx.answerCallbackQuery();

  const user = await User.findOne({
    telegramId: ctx.from.id,
  });

  if (!user) {
    return ctx.callbackQuery.message?.editText(
      "Shaxsiy kabinetingiz mavjud emas.\nIltimos /start orqali ro'yxatdan o'ting."
    );
  }

  const registrationDate = user.createdAt.toLocaleDateString("uz-Uz", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  ctx.callbackQuery.message?.editText(
    `Assalomu Aleykum: ${ctx.from.first_name}\nDate: ${registrationDate}\nSizda buyurtmalar mavjud emas.`,
    {
      reply_markup: new InlineKeyboard().text("Back", "backToMenu"),
    }
  );
};
