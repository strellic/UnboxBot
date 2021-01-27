import User from '../models/User.js';
import Item from '../models/Item.js';

import helpers from '../src/helpers.js';
import csgoData from '../src/csgoData.js';
import userData from '../src/userData.js';

let exports = {};

exports.run = async (client, prefix, msg, args) => {
	let id = msg.author.id;

	if(userData.get(id, "SELLING")) {
		if(args[0] && args[0].toLowerCase() == "confirm") {
			let user = await userData.getUser(msg.author);
			let items = user.items.slice(0);

			let itemIds = userData.get(id, "SELLING_ITEMS");

			let total = 0;
			let ids = [];
			let len = itemIds.length;

			for(let i = 0; i < items.length; i++) {
				if(itemIds.includes(items[i].id)) {
					total += items[i].price;
					ids.push(items[i]._id);
				}

				if(items[i].stickers.length > 0) {
					for(let j = 0; j < items[i].stickers.length; j++)
						ids.push(items[i].stickers[j]._id);
				}
			}

			await User.findOneAndUpdate(
				{ id: msg.author.id },
				{ 
					$inc: { money: total }, 
					$pullAll: { items: ids }
				},
		    );

			await Item.deleteMany({
				_id: {
					$in: ids
				}
			});

			msg.reply(`you sold **${len}** items. (**+$${total.toFixed(2)}**)`);
		}
		else
			msg.reply(`selling cancelled.`);

		userData.set(id, "SELLING", false);
		userData.set(id, "SELLING_ITEMS", null);

		return;
	}

	if(!args[0]) {
		return msg.reply(`usage: ${prefix}sell <item id | filters>`);
	}

	if(args.length == 1 && !isNaN(args[0]) && parseInt(args[0]) > 0) {
		let item = await userData.getUserItem(msg.author, parseInt(args[0]));

		if(!item) {
			return msg.reply(`invalid item id.`);
		}

		if(item.favorite) {
			return msg.reply(`you cannot sell an item you have favorited!`);
		}

		await User.findOneAndUpdate(
			{ id: msg.author.id },
			{ 
				$inc: { money: item.price }, 
				$pull: { items: item._id }
			},
	    );

	    let ids = [
	    	item._id
	    ];

	    if(item.stickers.length > 0) {
	    	for(let i = 0; i < item.stickers.length; i++)
	    		ids.push(item.stickers[i]._id);
	    }

		await Item.deleteMany({
			_id: {
				$in: ids
			}
		});

		return msg.reply(`you sold your ${helpers.itemToDisplay(item, false)}! (**+$${item.price}**)`);
	}
	else {
		let user = await userData.getUser(msg.author);
		let items = user.items.slice(0);

		items = helpers.itemFilter(items, args.join(" "));
		items = items.filter(i => !i.favorite);

		if(items.length == 0)
			return msg.reply(`no items found with that filter.`);

		let total = 0;
		let ids = [];
		for(let i = 0; i < items.length; i++) {
			total += items[i].price;
			ids.push(items[i].id);
		}

		userData.set(id, "SELLING", true);
		userData.set(id, "SELLING_ITEMS", ids);

		return msg.reply(`do you want to sell **${items.length} items** for **$${total.toFixed(2)}**? Type **${prefix}sell confirm** to confirm or **${prefix}sell cancel** to cancel. You can also check **${prefix}items** to verify the items being sold.`);
	}
}

exports.help = "Sell an item.";

export default exports;