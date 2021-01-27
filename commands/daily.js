import fs from 'fs';
import userData from '../src/userData.js';

let exports = {};

const settings = JSON.parse(fs.readFileSync("settings.json"));

exports.run = async (client, prefix, msg, args) => {
	let user = await userData.getUser(msg.author);

	let timeElapsed = Math.floor((new Date() - user.lastDaily)/1000);
	if(timeElapsed > settings.dailyTimer) {
		user.lastDaily = new Date();
		user.money += settings.dailyAmount;

		await user.save();
		return msg.reply(`**+$${settings.dailyAmount}** added! (**$${user.money.toFixed(2)}** total)`);
	}
	else {
		let timeLeft = Math.floor((settings.dailyTimer - timeElapsed)/60);

		let hoursLeft = Math.floor(timeLeft / 60);
		let minutesLeft = timeLeft % 60;

		return msg.reply(`the next ${prefix}daily reset is in **${hoursLeft}h ${minutesLeft}m**.`);
	}
}

exports.help = "Earn a daily amount of money.";

export default exports;