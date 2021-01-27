import Item from '../models/Item.js';

import helpers from '../src/helpers.js';
import csgoData from '../src/csgoData.js';
import userData from '../src/userData.js';

let exports = {};

exports.run = async (client, prefix, msg, args) => {
	if(args.length < 2 || !args[0] || isNaN(args[0]) || !args[1]) {
		return msg.reply(`usage: ${prefix}nickname <item id> <nickname>. ${prefix}nickname <item id> clear will remove a nickname.`);
	}

	let id = parseInt(args[0]);
	let item = await userData.getUserItem(msg.author, id);

	if(!item) {
		return msg.reply(`invalid item id.`);
	}

	let name = args.slice(1).join(" ").slice(0, 32);

	if(name == "clear") {
		await Item.findOneAndUpdate(
			{ _id: item._id },
			{ 
				$set: { nickName: null }
			},
		);
		return msg.reply(`nickname removed successfully!`);
	}

	await Item.findOneAndUpdate(
		{ _id: item._id },
		{ 
			$set: { nickName: name }
		},
	);
	return msg.reply(`nickname changed successfully!`);
}

exports.help = "Command to give an item a nickname.";

export default exports;