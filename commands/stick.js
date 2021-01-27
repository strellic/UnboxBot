import Item from '../models/Item.js';
import User from '../models/User.js';

import helpers from '../src/helpers.js';
import userData from '../src/userData.js';

let exports = {};

exports.run = async (client, prefix, msg, args) => {
	if(args.length < 2 || (args[0] && isNaN(args[0])) || (args[1] && isNaN(args[1]))) {
		return msg.reply(`usage: ${prefix}stick <sticker id> <weapon id>`);
	}

	let user = await userData.getUser(msg.author);

	let stickerId = parseInt(args[0]);
	let weaponId = parseInt(args[1]);

	let sticker = (user.items.filter(v => v.id == stickerId) || [])[0];
	let weapon 	= (user.items.filter(v => v.id == weaponId) || [])[0];

	if(!sticker || !weapon) {
		return msg.reply(`invalid item ids provided.`);
	}

	if(sticker.type != "Sticker" || !helpers.canHaveStickers.includes(weapon.type.toLowerCase())) {
		return msg.reply(`invalid item ids provided.`);
	}

	if(weapon.stickers.length >= 4) {
		return msg.reply(`there can only be a maximum of 4 stickers on a single weapon!`);
	}

	await Item.findOneAndUpdate(
		{ _id: weapon._id },
		{ 
			$push: { stickers: sticker }
		},
	);
	await Item.findOneAndUpdate(
		{ _id: sticker._id },
		{ 
			$set: {
				owner: null,
				id: weapon.stickers.length + 1
			}
		},
	);
	await User.findOneAndUpdate(
		{ id: msg.author.id },
		{ 
			$pull: { items: sticker._id }
		},
	);

	return msg.reply(`the sticker has been applied!`);
}
exports.help = "Command to stick stickers to weapons.";

export default exports;