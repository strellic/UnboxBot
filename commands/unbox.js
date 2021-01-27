import url from 'url';
import { v4 as uuidv4 } from 'uuid';

import helpers from '../src/helpers.js';
import userData from '../src/userData.js';
import csgoData from '../src/csgoData.js';

let exports = {};


exports.run = async (client, prefix, msg, args) => {
	let author = msg.author;
	let user = await userData.getUser(author);

	if(userData.get(msg.author.id, "COOLDOWN_UNBOX")) {
		return;
	}

	let cases = user.cases;
	let collections = user.collections;
	let tournCapsules = user.tournCapsules;
	
	cases = cases.filter(obj => obj.amount > 0 && obj.keys > 0);
	collections = collections.filter(obj => obj.amount > 0);
	tournCapsules = tournCapsules.filter(obj => obj.amount > 0);

	let lines = [];
	let indices = [];

	let index = 1;
	if(cases) {
		for(let i = 0; i < cases.length; i++, index++) {
			let obj = cases[i];
			let maxTimes = Math.min(obj.amount, obj.keys);
			lines.push(`${prefix}unbox ${index} - **${obj.name}** (**x${maxTimes}**)`);
			indices.push({
				type: "case",
				index: i
			});
		}
	}
	if(collections) {
		for(let i = 0; i < collections.length; i++, index++) {
			let obj = collections[i];
			lines.push(`${prefix}unbox ${index} - **${obj.name}** (**x${obj.amount}**)`);
			indices.push({
				type: "collection",
				index: i
			});
		}
	}
	if(tournCapsules) {
		for(let i = 0; i < tournCapsules.length; i++, index++) {
			let obj = tournCapsules[i];
			lines.push(`${prefix}unbox ${index} - **${obj.name}** (**x${obj.amount}**)`);
			indices.push({
				type: "tournCapsule",
				index: i
			});
		}
	}

	if(!args[0] || isNaN(args[0])) {
		let embed = helpers.embed()
		.setTitle("Unbox");

		let chunkLines = helpers.chunkArr(lines, 15);
		helpers.menuifyDescription(msg, embed, chunkLines);

		return;
	}
	else {
		let selected = indices[parseInt(args[0])-1];
		if(!selected) {
			return msg.reply("invalid number.");
		}

		let times = 1;
		if(args[1] && !isNaN(args[1])) {
			times = parseInt(args[1]);
			if(times > 10)
				return msg.reply("you can only unbox a maximum of 10 at a time.");
		}

		let obj = null;
		let index = null;

		if(selected.type === "case") {
			obj = cases[selected.index];
			index = user.cases.findIndex(c => c.name == obj.name);

			if(!user.cases[index] || user.cases[index].amount < times || user.cases[index].keys < times) {
				return msg.reply("you do not have enough cases or keys!");
			}

			user.cases[index].amount -= times;
			user.cases[index].keys -= times;
		}
		else if(selected.type === "collection") {
			obj = collections[selected.index];
			index = user.collections.findIndex(c => c.name == obj.name);
			if(!user.collections[index] || user.collections[index].amount < times) {
				return msg.reply("you do not have enough to unbox.");
			}

			user.collections[index].amount -= times;
		}
		else if(selected.type === "tournCapsule") {
			obj = tournCapsules[selected.index];
			index = user.tournCapsules.findIndex(c => c.name == obj.name);

			if(!user.tournCapsules[index] || user.tournCapsules[index].amount < times) {
				return msg.reply("you do not have enough to unbox.");
			}

			user.tournCapsules[index].amount -= times;
		}
		
		let saved_id = uuidv4();
		userData.set(msg.author.id, "COOLDOWN_UNBOX", saved_id);
		setTimeout(() => {
			if(userData.get(msg.author.id, "COOLDOWN_UNBOX") == saved_id)
				userData.set(msg.author.id, "COOLDOWN_UNBOX", null);
		}, 15000);

		await user.save();

		if(times > 5)
			msg.reply("please wait... :snail:");

		let title = `Unboxing: ${obj.name}`;

		let embed = helpers.embed()
		.setAuthor(msg.author.username)
		.setTitle(title);

		await msg.react(`✅`);

		let data = csgoData.getListFromContainer(obj.name);
		let rarities = data.rarities.sort((a, b) => b-a);

		let cheat = {};
		if(userData.get(author.id, "CHEAT_RARITY")) {
			cheat.rarity = {};
			cheat.rarity.rarity = userData.get(author.id, "CHEAT_RARITY");
			cheat.rarity.index = helpers.rngRangeInt(0, times - 1);

			userData.set(author.id, "CHEAT_RARITY", null);
		}
		if(userData.get(author.id, "CHEAT_UNBOX")) {
			cheat.unbox = {};
			cheat.unbox.item = userData.get(author.id, "CHEAT_UNBOX");
			cheat.unbox.index = helpers.rngRangeInt(0, times - 1);

			userData.set(author.id, "CHEAT_UNBOX", null);
		}

		let items = [];
		for(let i = 0; i < times; i++) {
			items[i] = [];
			for(let j = 0; j < 10; j++) {
				let level = helpers.getRarityRNG(rarities);

				if(cheat && cheat.rarity) {
					if(cheat.rarity.index == i && j == 9 && rarities.includes(cheat.rarity.rarity))
						level = cheat.rarity.rarity;
				}

				let skinList = [];
				if(level == 6) {
					skinList = data.rares;
				}
				else {
					skinList = data.skins[level];
				}

				let lowerName = helpers.rngChoice(skinList);

				let counter = 0; // fix for items not in items.json (rip)
				while(!csgoData.items[lowerName]) {
					console.log(`[ERROR] SKIPPING:`, lowerName);
					if(counter > 10) {
						console.log(`[ERROR] CANT UNBOX:`, level, data, obj, lowerName, skinList);
						msg.reply(`Sorry, but there was an error unboxing.`);
						return;
					}

					lowerName = helpers.rngChoice(skinList);
					counter += 1;
				}

				let unboxItem = csgoData.lowerNameToItem(lowerName);
				unboxItem = csgoData.finishItem(unboxItem);

				if(cheat && cheat.unbox) {
					if(cheat.unbox.index == i && j == 9) {
						let cheatLower = cheat.unbox.item.name.toLowerCase();
						if(data.rares.includes(cheatLower) || data.skins.flat().includes(cheatLower))
							unboxItem = cheat.unbox.item;
					}
				}

				items[i].push(unboxItem);
			}
		}

		if(times == 1) {
			let final = items[0][items[0].length - 1];
			let loc = await helpers.animate(items[0]);
			embed.setImage(`${loc}.gif`);

			await msg.channel.send(embed).then(async sent => {
				await helpers.snooze(4500);
				embed.setImage(`${loc}.png`);
				embed.setColor(helpers.rarityToColor(final.rarity));
				embed.setDescription(`You unboxed:\n**${helpers.rarityToEmoji(final.rarity) + " " + helpers.itemToDisplay(final)}**!`);
				await sent.edit(embed);
				userData.addItem(author, final);
			});

			userData.set(msg.author.id, "COOLDOWN_UNBOX", null);
		}
		else {
			let loc = await helpers.animateMulti(items);
			embed.setImage(`${loc}.gif`);

			let wins = [];
			for(let i = 0; i < items.length; i++)
				wins.push(items[i][items[i].length - 1]);

			await msg.channel.send(embed).then(async sent => {
				await helpers.snooze(4500);
				embed.setImage(`${loc}.png`);
				let maxRarity = Math.max(...wins.map(i => i.rarity));
				embed.setColor(helpers.rarityToColor(maxRarity));
				let msg = `You unboxed:\n**${wins.map(i => helpers.rarityToEmoji(i.rarity) + " " + helpers.itemToDisplay(i)).join("\n")}**`;
				embed.setDescription(msg);
				await sent.edit(embed);
				userData.addItems(author, wins);
			});
			userData.set(msg.author.id, "COOLDOWN_UNBOX", null);
		}
	}
}

exports.help = "Menu to unbox a container.";

export default exports;