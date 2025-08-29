import { CallbackQueryContext } from "grammy";
import { products } from "../constants/products.js";
import { MyContext } from "../types.js";

export const payments = (ctx: CallbackQueryContext<MyContext>) => {
  ctx.answerCallbackQuery();
  const productId = ctx.callbackQuery.data.split("-")[1];
  const product = products.find((p) => p.id === parseInt(productId));

  if (!product) {
    return ctx.callbackQuery.message?.editText(`Mahsulot topilmadi`);
  }

  try {
    const chatId = ctx.chat?.id;

    if (!chatId) {
      throw new Error("Chat ID is not defined");
    }

    ctx.api.sendInvoice(
      chatId,
      product.name,
      product.description,
      product.id.toString(),
      "RUB",
      [
        {
          label: "UZS",
          amount: product.price,
        },
      ]
    );
  } catch (error) {}

  ctx.callbackQuery.message?.editText(
    `Mahsulot: ${product.name}\nNarxi: ${product.price}\nTavsif: ${product.description}\nBuyurtma berish uchun /start orqali ro'yxatdan o'ting.`
  );
};
