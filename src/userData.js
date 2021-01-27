import User from '../models/User.js';
import Item from '../models/Item.js';
import csgoData from './csgoData.js';

let exports = {};

exports.store = {};

exports.get = (id, key) => {
	if(!exports.store[id])
		exports.store[id] = {};

	return exports.store[id][key];
}
exports.set = (id, key, value) => {
	if(!exports.store[id])
		exports.store[id] = {};

	exports.store[id][key] = value;
}

exports.getUser = async (user) => {
	let dbUser = await User.findOne({
		id: user.id
	})
	.populate({
		'path': 'items',
		populate: {
			path: 'stickers'
		}
	});

	if(!dbUser) {
		dbUser = await new User({
			id: user.id
		});
		await dbUser.save();
	}

	let changed = false;

	if(!dbUser.username || dbUser.username != user.tag) {
		dbUser.username = user.tag;
		changed = true;
	}

	if(!dbUser.avatar || dbUser.avatar != user.avatarURL({format: "png"})) {
		dbUser.avatar = user.avatarURL({format: "png"});
		changed = true;
	}

	if(changed)
		await dbUser.save();

	for(let i = 0; i < dbUser.items.length; i++) {
		dbUser.items[i].price = csgoData.getItemPrice(dbUser.items[i]);

		for(let j = 0; j < dbUser.items[i].stickers.length; j++)
			dbUser.items[i].stickers[j].price = csgoData.getItemPrice(dbUser.items[i].stickers[j]);
	}

	return dbUser;
}

exports.getUserItem = async (user, itemid) => {
	let dbUser = await exports.getUser(user);
	let items = dbUser.items;

	let item = (items.filter(v => v.id == itemid) || [])[0];

	return item;
}

exports.addItem = async(user, item) => {
	let dbUser = await exports.getUser(user);

	let index = dbUser.lastItem + 1;
	dbUser.lastItem += 1;

	item.id = index;
	item.owner = dbUser;
	let dbItem = await new Item(item);
	dbItem.save();

	dbUser.items.push(dbItem);
	dbUser.save();
}

exports.addItems = async(user, items) => {
	let dbUser = await exports.getUser(user);

	for(let i = 0; i < items.length; i++) {
		let item = items[i];

		let index = dbUser.lastItem + 1;
		dbUser.lastItem += 1;

		item.id = index;
		item.owner = dbUser;
		let dbItem = await new Item(item);
		dbItem.save();

		dbUser.items.push(dbItem);
	}
	
	dbUser.save();
}

export default exports;