let exports = {};

exports.run = (client, prefix, msg, args) => {
	msg.reply(`pong! (${client.ws.ping} ms)`);
}

exports.help = "Returns the ping of the bot.";

export default exports;