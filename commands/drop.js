import fs from 'fs';
import helpers from '../src/helpers.js';
import userData from '../src/userData.js';
import csgoData from '../src/csgoData.js';

const settings = JSON.parse(fs.readFileSync("settings.json"));

let exports = {};

/*
let test = [];
let keys = Object.keys(allItems)

for(let i = 0; i < keys.length; i++) {
    if(keys[i].includes(" | ")) {
        let id = keys[i].split(" | ")[0];
        if(!test.includes(id))
            test.push(id);
    }
}
*/

exports.run = async (client, prefix, msg, args) => {
	let user = await userData.getUser(msg.author);

	let timeElapsed = Math.floor((new Date() - user.lastDrop)/1000);
	if(timeElapsed > settings.dailyDropTimer) {
		let names = Object.keys(csgoData.items);

		let allowed = helpers.droppables;

		names = names.filter(i => i.length > 0 && allowed.includes(i.split(" | ")[0]));
		names = names.filter(i => !csgoData.unboxables.includes(i));

		let items = [
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		];
		for(let i = 0; i < names.length; i++) {
			let rarity = 0;

			if(names[i] == "m4a4 | howl")
				rarity = 5; //yes, it's rarity 6 but rarity 6 would make it less rare to drop
			else if(csgoData.items[names[i]])
				rarity = csgoData.items[names[i]].rarity || 0;

			items[rarity].push(names[i]);
		}
		items = items.filter(v => v.length > 0);

		let rarities = [];
		for(let i = 0; i < items.length; i++) {
			if(items[i].length > 1)
				rarities.push(i);
		}

		let rarity = helpers.getRarityRNG(rarities.reverse());
		let name = helpers.rngChoice(items[rarity]);

		let unboxItem = csgoData.lowerNameToItem(name);
		unboxItem = csgoData.finishItem(unboxItem);

		if(userData.get(msg.author.id, "CHEAT_DROP")) {
			if(items.flat().includes(userData.get(msg.author.id, "CHEAT_DROP").name.toLowerCase())) {
				unboxItem = userData.get(msg.author.id, "CHEAT_DROP");
			}
			userData.set(msg.author.id, "CHEAT_DROP", null);
		}

		let embed = helpers.embed()
		.setAuthor(msg.author.username)
		.setTitle(`You were dropped: ${helpers.itemToDisplay(unboxItem)}!`)
		.setColor(helpers.rarityToColor(unboxItem.rarity));

		await helpers.setEmbedItemImage(embed, unboxItem);

		msg.channel.send(embed);

		userData.addItem(msg.author, unboxItem);

		user.lastDrop = new Date();
		await user.save();
	}
	else {
		let timeLeft = Math.floor((settings.dailyDropTimer - timeElapsed)/60);

		let hoursLeft = Math.floor(timeLeft / 60);
		let minutesLeft = timeLeft % 60;

		return msg.reply(`the next ${prefix}drop reset is in **${hoursLeft}h ${minutesLeft}m**.`);
	}
}

exports.help = "Earn a daily random item drop.";

export default exports;