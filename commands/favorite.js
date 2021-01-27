import Item from '../models/Item.js';

import helpers from '../src/helpers.js';
import csgoData from '../src/csgoData.js';
import userData from '../src/userData.js';

let exports = {};

exports.run = async (client, prefix, msg, args) => {
	if(args.length < 1 || !args[0] || isNaN(args[0])) {
		return msg.reply(`usage: ${prefix}favorite <item id>. Favoriting an item will prevent it from being sold.`);
	}

	let id = parseInt(args[0]);
	let item = await userData.getUserItem(msg.author, id);

	if(!item) {
		return msg.reply(`invalid item id.`);
	}

	await Item.findOneAndUpdate(
		{ _id: item._id },
		{ 
			$set: { favorite: !item.favorite }
		},
	);
	return msg.reply(`you have ${item.favorite ? 'unfavorited' : 'favorited'} your item.`);
}

exports.help = "Command to favorite an item.";

export default exports;