import userData from '../src/userData.js';
import helpers from '../src/helpers.js';

import { v4 as uuidv4 } from 'uuid';

let exports = {};

exports.run = async (client, prefix, origin, args) => {
	let guildId = origin.channel.guild.id;
	let user = await userData.getUser(origin.author);

	let data = () => userData.get(guildId, "CRASH");

	let init = async () => {
		let saved_id = uuidv4();
		data().id = saved_id;

		let embed = helpers.embed()
		.setTitle(`Crash`)
		.setDescription(`Type **${prefix}crash <money>** to enter. When the game starts, press the :bomb: to leave before it's too late!`)
		.addField(`Starting in:`, `20 seconds...`)
		.addField(`Players:`, `None`);

		let options = [
			{reaction: "💣", timer: 9999999, disabled: true, run: async (r, collectors, embedMsg, embed, user) => {
				if(!data() || !data().active || !data().started)
					return;

				if(data().players.find(v => v.author.id == user.id)) {
					let index = data().players.findIndex(v => v.author.id == user.id);
					let winnerData = data().players[index];

					data().players.splice(index, 1);

					data().winners.push({
						name: winnerData.name,
						bet: winnerData.bet,
						multiplier: data().multiplier
					});

					userData.getUser(winnerData.author).then(winner => {
						winner.money += (winnerData.bet * data().multiplier);
						winner.save();
					});
				}
			}}
		];

		let msg = await helpers.menuify(origin, embed, options);

		let timer = setInterval(async () => {
			data().timer -= 1;

			let players = data().players.map(v => `${v.name} ($${v.bet})`).join("\n");
			if(!players)
				players = "None";

			embed.spliceFields(0, 2, [
				{name: `Starting in:`, 	value: `${data().timer} seconds...`},
				{name: `Players:`, 		value: players},
			]);

			await msg.edit(embed);

			if(data().timer == 0) {
				clearInterval(timer);
				crash();
			}

		}, 1250);

		let crash = async () => {
			embed.spliceFields(0, 1, [
				{name: `Multiplier:`, 	value: `${data().multiplier}x`},
			]);
			await msg.edit(embed);
			await msg.react("💣");

			data().started = true;

			let timer2 = setInterval(async () => {
				if((!data().cheatMultiplier && Math.random() < 0.1) || (data().cheatMultiplier && data().cheatMultiplier <= data().multiplier)) {
					clearInterval(timer2);
					end();
				}
				else {
					let players = data().players.map(v => `${v.name} ($${v.bet})`).join("\n");
					if(!players)
						players = "None";

					data().multiplier += 0.1;
					embed.spliceFields(0, 2, [
						{name: `Multiplier:`, value: `${data().multiplier.toFixed(1)}x`},
						{name: `Players:`, 	 value: players},
					]);
					await msg.edit(embed);
				}
			}, 1500);
		}

		let end = async () => {
			setTimeout(() => {
				if(userData.get(guildId, "CRASH") && userData.get(guildId, "CRASH").id == saved_id)
					userData.set(guildId, "CRASH", null);
			}, 15000);

			let winners = data().winners.map(v => `${v.name}: $${v.bet.toFixed(2)} * ${v.multiplier.toFixed(1)}x = **+$${(v.bet * v.multiplier).toFixed(2)}**`).join('\n');
			if(!winners)
				winners = "No one survived!";

			embed.spliceFields(1, 1, [
				{name: `Winners`, 	value: winners},
				{name: `:boom: :boom: :boom: :boom: :boom:`, 	value: `The bomb exploded!`},
			]);

			await msg.edit(embed);
			msg.reactions.removeAll();

			userData.get(guildId, "CRASH", null);
		}

		return msg;
	}

	if(!data()) {
		userData.set(guildId, "CRASH", {
			active: true,
			timer: 20,
			started: false,
			players: [],
			multiplier: 1.0,
			winners: [],
			cheatMultiplier: null
		});
		let msg = await init();
		data().msg = msg;
	}

	if(args[0] && !isNaN(args[0]) && parseFloat(args[0]) > 0) {
		if(!data() || !data().msg)
			return;

		if(data().players.find(p => p.author.id == origin.author.id))
			return;

		let bet = parseFloat(args[0]);
		if(user.money < bet)
			return origin.reply(`you do not have enough money.`);

		user.money -= bet;
		await user.save();

		data().players.push({
			author: origin.author,
			name: origin.author.username,
			bet: bet
		});

		if(userData.get(origin.author.id, "CHEAT_CRASH")) {
			data().cheatMultiplier = userData.get(origin.author.id, "CHEAT_CRASH");
			userData.set(origin.author.id, "CHEAT_CRASH", null);
		}
	}
}

exports.help = "Command to start a game of crash.";

export default exports;