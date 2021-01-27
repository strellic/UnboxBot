import helpers from '../src/helpers.js';
import userData from '../src/userData.js';

let exports = {};

exports.run = async (client, prefix, msg, args) => {
	if(args.length < 2 || isNaN(args[1]))
		return msg.reply(`usage: ${prefix}coinflip <heads/tails> <bet>`);

	let choice = args[0].toLowerCase();
	let bet = parseFloat(args[1]);

	if((choice != 'heads' && choice != 'tails') || bet <= 0)
		return msg.reply(`usage: ${prefix}coinflip <heads/tails> <bet>`);

	let user = await userData.getUser(msg.author);
	if(user.money < bet) {
		return msg.reply(`you do not have enough money!`);
	}

	let isHeads = (Math.random() > 0.5);

	if(userData.get(msg.author.id, "CHEAT_COINFLIP")) {
		isHeads = (userData.get(msg.author.id, "CHEAT_COINFLIP") === "heads");
		userData.set(msg.author.id, "CHEAT_COINFLIP", null);
	}

	let img = ``;
	if(isHeads) {
		img = `./heads.png`;
	}
	else {
		img = `./tails.png`;
	}

	let result = [];
	if((isHeads && choice == 'heads') || (!isHeads && choice == 'tails')) {
		result[0] = "You won!";
		result[1] = `$${bet.toFixed(2)} * 2.0x = **+$${(bet * 2.0).toFixed(2)}**`;
		user.money += bet;
	}
	else {
		result[0] = "Nice try!";
		result[1] = `$${bet.toFixed(2)} * -1.0x = **-$${(bet).toFixed(2)}**`;
		user.money -= bet;
	}

	await user.save();

	let embed = helpers.embed()
	.setTitle(`Coinflip`)
	.setImage(helpers.resolveURL(img))
	.addField(result[0], result[1]);
	msg.channel.send(embed);
}

exports.help = "Command to flip a coin!";

export default exports;