require("dotenv").config();
const { Telegraf } = require("telegraf");
const nlp = require("./v3");
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on("text", async (ctx) => {
  const { Wit, log } = require("node-wit");
  const client = new Wit({
    accessToken: process.env.WITAI_TOKEN,
  });
  const msg = ctx.message.text;
  const wit = await client.message(msg);
  console.log("wit reply", JSON.stringify(wit));
  const reply = await nlp.handleMessage(wit.entities, wit.traits);
  console.log("reply", reply);
  ctx.reply(reply);
});

bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));