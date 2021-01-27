import userData from '../src/userData.js';

let exports = {};

exports.run = async (client, prefix, msg, args) => {
	let user = await userData.getUser(msg.author);
	return msg.reply(`you have **$${user.money.toFixed(2)}**.`);
}

exports.help = "Check amount of money.";

export default exports;