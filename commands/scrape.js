import Item from '../models/Item.js';
import User from '../models/User.js';

import helpers from '../src/helpers.js';
import userData from '../src/userData.js';

let exports = {};

exports.run = async (client, prefix, msg, args) => {
	if(args.length < 2 || (args[0] && isNaN(args[0])) || (args[1] && isNaN(args[1]))) {
		return msg.reply(`usage: ${prefix}stick <weapon id> <sticker number>`);
	}

	let user = await userData.getUser(msg.author);

	let weaponId = parseInt(args[0]);
	let stickerNum = parseInt(args[1]) - 1;

	let weapon 	= await userData.getUserItem(msg.author, weaponId);

	if(!weapon || !weapon.stickers)
		return msg.reply(`invalid item ids provided.`);

	let sticker = weapon.stickers[stickerNum];

	if(!sticker) {
		return msg.reply(`invalid item ids provided.`);
	}

	await Item.findOneAndUpdate(
		{ _id: weapon._id },
		{ 
			$pull: { stickers: sticker._id }
		},
	);
	await Item.deleteOne(
		{ _id: sticker._id },
	);

	return msg.reply(`the sticker has been scraped!`);
}
exports.help = "Command to scrape stickers from weapons.";

export default exports;