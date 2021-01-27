import userData from '../src/userData.js';
import helpers from '../src/helpers.js';

import { v4 as uuidv4 } from 'uuid';

let exports = {};

exports.run = async (client, prefix, origin, args) => {
	let guildId = origin.channel.guild.id;
	let data = () => userData.get(guildId, "ROULETTE");

	let init = async () => {
		let embed = helpers.embed()
		.setTitle(`Roulette`)
		.setDescription(`Type **${prefix}roulette <money> <red|black|odd|even|green|number>** to enter!`)
		.addField(`Starting in:`, `20 seconds...`)
		.addField(`Players:`, `None`);

		let msg = await origin.channel.send(embed);

		let timer = setInterval(async () => {
			if(!data || !data().timer)
				return clearInterval(timer);
			
			data().timer -= 1;

			let players = data().players.map(v => `${v.name} ($${v.bet}) [${v.type}]`).join("\n");
			if(!players)
				players = "None";

			embed.spliceFields(0, 2, [
				{name: `Starting in:`, 	value: `${data().timer} seconds...`},
				{name: `Players:`, 		value: players},
			]);

			await msg.edit(embed);

			if(data().timer <= 0) {
				clearInterval(timer);
				roulette();
			}

		}, 1250);

		let roulette = async () => {
			let endings = [
				"black_2","black_4","black_6","black_8","black_10","black_11","black_13","black_15","black_17","black_20","black_22","black_24","black_26","black_28","black_29","black_31","black_33","black_35","green_0","red_1","red_3","red_5","red_7","red_9","red_12","red_14","red_16","red_18","red_19","red_21","red_23","red_25","red_27","red_30","red_32","red_34","red_36"
			];
			embed.spliceFields(0, 1);

			let win = helpers.rngChoice(endings);

			if(data().cheat)
				win = data().cheat;

			let img = helpers.resolveURL(`./roulette/gif/${win}.gif`);
			embed.setImage(img);
			await msg.edit(embed);

			let color = win.split("_")[0];
			let num = parseInt(win.split("_")[1]);

			let emoji = `:${color}_circle:`;

			setTimeout(async () => {
				embed.addField(`Rolled:`, `**${emoji} ${color[0].toUpperCase() + color.toLowerCase().substr(1)} #${num}**`);

				let msgArray = [];
				for(let i = 0; i < data().players.length; i++) {
					let player = data().players[i];
					let payout = 0;

					if(num == 0 && (player.type === "green" || player.type === "0")) {
						payout = 35;
					}
					else if(!isNaN(player.type) && parseInt(player.type) == num) {
						payout = 35;
					}
					else if(num != 0 && player.type === "even" && num % 2 == 0) {
						payout = 2;
					}
					else if(num != 0 && player.type === "odd" && num % 2 != 0) {
						payout = 2;
					}
					else if(player.type === color) {
						payout = 2;
					}

					if(payout != 0) {
						msgArray.push(
							`:white_check_mark: ${player.name} [${player.type}]: $${player.bet} * ${payout.toFixed(2)}x = **+${(player.bet * payout).toFixed(2)}**`
						);

						let user = await userData.getUser(player.author);
						user.money += (player.bet * payout);
						await user.save();
					}
					else {
						msgArray.push(
							`:x: ${player.name} [${player.type}]: $${player.bet} * -1.0x = **-${player.bet.toFixed(2)}**`
						);
					}
				}

				let embedMsg = msgArray.join('\n');
				if(!embedMsg)
					embedMsg = "No players joined."

				embed.spliceFields(0, 1, [
					{name: "Players", value: embedMsg}
				]);
				embed.setColor(["#FF0000", "#000000", "#00FF00"][["red", "black", "green"].indexOf(color)]);
				embed.setImage(helpers.resolveURL(`./roulette/png/${win}.png`));
				await msg.edit(embed);

				userData.set(guildId, "ROULETTE", null);
			}, 7500);
		}
	}

	if(!data()) {
		let saved_id = uuidv4();
		userData.set(guildId, "ROULETTE", {
			active: true,
			timer: 20,
			players: [],
			id: saved_id,
			cheat: null
		});
		await init();
		setTimeout(() => {
			if(userData.get(guildId, "ROULETTE") && userData.get(guildId, "ROULETTE").id == saved_id)
				userData.set(guildId, "ROULETTE", null);
		}, 45000);
	}

	if(data() && args[0] && !isNaN(args[0]) && parseFloat(args[0]) > 0 && args[1]) {
		let user = await userData.getUser(origin.author);

		if(data().players.find(p => p.author.id == origin.author.id))
			return;

		let bet = parseFloat(args[0]);
		if(user.money < bet)
			return origin.reply(`you do not have enough money.`);

		let type = args[1].toLowerCase();

		if(isNaN(args[1]) && !["red", "black", "green", "odd", "even"].includes(type))
			return origin.reply(`usage: ${prefix}roulette <money> <red|black|odd|even|green|number>`);

		if(!isNaN(args[1]) && (parseInt(args[1]) < 0 || parseInt(args[1]) > 36))
			return origin.reply(`usage: ${prefix}roulette <money> <red|black|odd|even|green|number>`);

		user.money -= bet;
		await user.save();

		data().players.push({
			author: origin.author,
			name: origin.author.username,
			bet: bet,
			type: type
		});

		if(userData.get(origin.author.id, "CHEAT_ROULETTE")) {
			data().cheat = userData.get(origin.author.id, "CHEAT_ROULETTE");
			userData.set(origin.author.id, "CHEAT_ROULETTE", null);
		}
	}
}

exports.help = "Command to start a game of roulette.";

export default exports;