import { InlineKeyboard } from "grammy";
import { User } from "../models/User.js";
import { MyContext } from "../types.js";

export const start = async (ctx: MyContext) => {
  if (!ctx.from) {
    return ctx.reply("User info is not available");
  }

  const { id, username, first_name } = ctx.from;

  try {
    const keyboard = new InlineKeyboard().text("Menu", "menu");

    const existingUser = await User.findOne({ telegramId: id });

    if (existingUser) {
      return ctx.reply(`Welcome back, ${first_name}`, {
        reply_markup: keyboard,
      });
    }

    const newUser = new User({
      telegramId: id,
      firstName: first_name,
      username,
    });

    await newUser.save();

    return ctx.reply(`You are registered, ${first_name}`, {
      reply_markup: keyboard,
    });
  } catch (error) {
    console.error("Error in start command:", error);
    ctx.reply("An error occurred while processing your request.");
  }
};
