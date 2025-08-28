import { CallbackQueryContext, InlineKeyboard } from "grammy";
import { products } from "../constants/products.js";
import { MyContext } from "../types.js";

export const productsCommand = (ctx: CallbackQueryContext<MyContext>) => {
  ctx.answerCallbackQuery();

  const productsList = products.reduce((acc, cur) => {
    return (
      acc +
      `- ${cur.name}\nPrice: ${cur.price}\nDescription: ${cur.description}\n\n`
    );
  }, "");

  const messageText = `All products:\n\n${productsList}`;

  const keyboardButtonRows = products.map((product) => {
    return InlineKeyboard.text(product.name, `buyProduct-${product.id}`);
  });

  const keyboard = InlineKeyboard.from([
    keyboardButtonRows,
    [InlineKeyboard.text("Back", "backToMenu")],
  ]);

  ctx.callbackQuery.message?.editText(messageText, {
    reply_markup: keyboard,
  });
};
