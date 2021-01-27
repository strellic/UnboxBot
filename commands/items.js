import helpers from '../src/helpers.js';
import csgoData from '../src/csgoData.js';
import userData from '../src/userData.js';

let exports = {};

exports.run = async (client, prefix, msg, args) => {
	let id = msg.author.id;

	let embed = helpers.embed();

	let lines = [];
	let user = await userData.getUser(msg.author);
	let items = user.items.slice(0).reverse();

	let page = 1;

	if(args.length > 0) {
		if(!isNaN(args[0])) {
			page = parseInt(args[0])
			items = helpers.itemFilter(items, args.slice(1).join(" "));
		}
		else
			items = helpers.itemFilter(items, args.join(" "));
	}

	let total = 0;

	if(items.length > 0) {
		for(let i = 0; i < items.length; i++) {
			let item = items[i];
			let msg = `${helpers.rarityToEmoji(item.rarity)} ${helpers.itemToDisplay(item)} **(#${item.id})**`;

			if(userData.get(id, "SELLING") && userData.get(id, "SELLING_ITEMS").includes(item.id))
				msg += ` :moneybag:`;

			total += item.price;

			lines.push(msg);
		}
	}

	embed.setTitle(`${msg.author.username}'s Items\nTotal value: $${total.toFixed(2)}`);

	let chunkLines = helpers.chunkArr(lines, 15);
	helpers.menuifyDescription(msg, embed, chunkLines, false, page);
}

exports.help = "Shows your inventory of cases and keys.";

export default exports;