import request from 'request-promise';
import UserAgent from 'user-agents';
import url from 'url';
import fs from 'fs';

import helpers from './helpers.js';

let REGEX_ITEMS 		= /^var allItems = ({.*?});$/m;
let REGEX_CONTAINERS 	= /^var allContainers = ({.*?});$/m;
let REGEX_RARES			= /^var rares = ({.*?});$/m;

let exports = {};

exports.init = async (skip = false) => {
	console.time("[BOT] Load time");

	if(fs.existsSync('./data/itemsList.json')) {
		let lastModified = fs.statSync('./data/itemsList.json').mtime;
		let currentTime = new Date();
		let sec = (currentTime.getTime() - lastModified.getTime()) / 1000;

		if(sec <= 3600)
			skip = true;
	}

	try {
		if(skip)
			throw new Error('Skip');

		let agent = new UserAgent();

		let data = await request({
		    method: 'get',
		    uri: "https://convars.com/case/en",
		    headers: {
		   		'User-Agent': agent.toString()
		    },
		    timeout: 6000,
		    resolveWithFullResponse: true
		});

		let items 		= data.body.match(REGEX_ITEMS);
		let containers 	= data.body.match(REGEX_CONTAINERS);
		let rares 		= data.body.match(REGEX_RARES);

		exports.items 		= JSON.parse(items[1]);
		exports.containers 	= JSON.parse(containers[1]);
		exports.rares 		= JSON.parse(rares[1]);

		fs.writeFileSync("./data/items.json", 		JSON.stringify(exports.items));
		fs.writeFileSync("./data/containers.json", 	JSON.stringify(exports.containers));
		fs.writeFileSync("./data/rares.json", 		JSON.stringify(exports.rares));

		console.log('[BOT] Items/containers loaded successfully...');
	}
	catch(err) {
		console.log("[BOT] Loading locally saved data...", err.statusCode || err.message);
		exports.items 		= JSON.parse(fs.readFileSync("./data/items.json"));
		exports.containers 	= JSON.parse(fs.readFileSync("./data/containers.json"));
		exports.rares 		= JSON.parse(fs.readFileSync("./data/rares.json"));
	}

	[exports.types, exports.families, exports.unboxables] = exports.initTypes();

	try {
		if(skip)
			throw new Error('Skip');

		let data = await request({
			method: 'get',
			uri: "http://csgobackpack.net/api/GetItemsList/v2/",
			timeout: 6000,
			resolveWithFullResponse: true
		});

		exports.itemsList = {};

		let parsed = JSON.parse(data.body).items_list;
		let key, keys = Object.keys(parsed);
		let n = keys.length;
		while (n--) {
			key = keys[n];
			exports.itemsList[key.toLowerCase()] = parsed[key];
		}

		fs.writeFileSync("./data/itemsList.json", JSON.stringify(exports.itemsList));

		console.log('[BOT] Item images loaded successfully...');
	}
	catch(err) {
		console.log("[BOT] Loading locally saved itemList...", err.statusCode || err.message);
		exports.itemsList = JSON.parse(fs.readFileSync("./data/itemsList.json"));
	}

	// manual additions
	exports.items["sticker | titan (holo) | katowice 2014"] = {
	    "rarity": 3,
	    "price_common": 663000
	};
	exports.items["sticker | lgb esports (holo) | katowice 2014"] = {
	    "rarity": 3,
	    "price_common": 93250
	};
	exports.items["sticker | team dignitas (holo) | katowice 2014"] = {
	    "rarity": 3,
	    "price_common": 342500
	};
	exports.items["sticker | hellraisers (holo) | katowice 2014"] = {
	    "rarity": 3,
	    "price_common": 293750
	};
	exports.items["sticker | team ldlc.com (holo) | katowice 2014"] = {
	    "rarity": 3,
	    "price_common": 292500
	};

	console.log("[BOT] CSGO data loaded!");	
	console.timeEnd("[BOT] Load time");

	return;
}
/*
let imgs = [];
for(let i = 0; i < Object.keys(allItems).length; i++) {
    let item = allItems[Object.keys(allItems)[i]];
    imgs.push(...Object.values(item.imgs))
}
imgs = imgs.map(i => i.replace("../", "https://convars.com/"));
*/
exports.initTypes = () => {
    let types = [];
    let families = [];
    let unboxables = [];

    for(let i = 0; i < Object.keys(exports.containers).length; i++) {
        let container = exports.containers[Object.keys(exports.containers)[i]];
        let items = container.items;

        types = types.concat(Object.values(items).flat().map(v => v[0]));
        types = [...new Set(types)];

        families = families.concat(Object.values(items).flat().map(v => v[1]));
        families = families.filter(l => l.length);
        families = [...new Set(families)];

        unboxables = unboxables.concat(Object.values(items).flat().map(v => v.lowerName));
        unboxables = [...new Set(unboxables)];
    }
    types = types.filter(t => !t.startsWith("★"));
    families = families.filter(t => !t.startsWith("★"));

    for(let i = 0; i < Object.keys(exports.rares).length; i++) {
        let container = exports.rares[Object.keys(exports.rares)[i]];
        let items = container.items;

        let defItem = container.name[1];
        if(defItem && defItem.length > 0) {
        	types.push(defItem.split(" | ")[0]);
        	families.push(defItem.split(" | ").slice(1).join(" | "));
        	unboxables.push(defItem);
        }

        types = types.concat(Object.values(items).flat().map(v => v[0]));
        types = [...new Set(types)];

        families = families.concat(Object.values(items).flat().map(v => v[1]));
        families = families.filter(l => l.length);
        families = [...new Set(families)];

        unboxables = unboxables.concat(Object.values(items).flat().map(v => v.lowerName));
        unboxables = [...new Set(unboxables)];
    }

    return [types, families, unboxables];
}

exports.getCases = () => {
	let containers = [];
	for (let name of Object.keys(exports.containers)) {
		if(exports.containers[name].type === "cases") {
			let obj = exports.containers[name];
			containers.push({
				name: obj.name[0],
				price: exports.items[obj.name[0].toLowerCase()].price_common / 100,
				keyPrice: obj.name[3] / 100
			});
		}
	}

	return containers;
}

exports.getCollections = () => {
	let collections = [];
	for (let name of Object.keys(exports.containers)) {
		if(exports.containers[name].type === "souvs") {
			let obj = exports.containers[name];
			collections.push({
				name: obj.name[0],
				price: exports.items[obj.name[0].toLowerCase()].price_common / 100
			});
		}
	}
	return collections;
}

exports.getTournamentCapsules = () => {
	let capsules = [];
	for (let name of Object.keys(exports.containers)) {
		if(exports.containers[name].type === "tours") {
			let obj = exports.containers[name];
			capsules.push({
				name: obj.name[0],
				price: exports.items[obj.name[0].toLowerCase()].price_common / 100
			});
		}
	}
	return capsules;
}

exports.getListFromContainer = (name) => {
	let obj = {
		name: name,
		rarities: [],
		skins: [],
		rares: [],
	};

	for (let id of Object.keys(exports.containers)) {
		if(exports.containers[id].name[0] === name) {
			obj.rarities = exports.containers[id].levels_n;

			let items = exports.containers[id].items;

			for(let rarity of Object.keys(items)) {
				obj.skins[rarity] = [];
				for(let i = 0; i < items[rarity].length; i++) {
					if(items[rarity][i]["1"].length > 0) {
						obj.skins[rarity].push(items[rarity][i]["lowerName"]);
					}
					else {
						obj.skins[rarity].push(items[rarity][i]["lowerName"]);
					}
				}
			}

			let specialType = exports.containers[id].name[2];
			if(specialType === "none")
				break;

			let rareItems = exports.rares[specialType].items["6"];
			for(let i = 0; i < rareItems.length; i++) {
				if(rareItems[i]["1"].length > 0) {
					obj.rares.push(rareItems[i]["lowerName"]);
				}
				else {
					obj.rares.push(rareItems[i]["lowerName"]);
				}
			}

			let defItem = exports.rares[specialType].name[1];
			if(defItem && defItem.length > 0) {
				obj.rares.push(defItem.toLowerCase());
			}

			break;
		}
	}

	return obj;
}

exports.getItemPrice = (item) => {
	let itemInfo = exports.items[item.name.toLowerCase()];

	if(!itemInfo) {
		console.log(`[ERROR] Could not find price for: `, item);
		return 0.00;
	}

	let id = "common";
	if(item.float)
		id = helpers.floatToName(item.float);

	if(item.statTrak)
		id += "_ST";
	else if(item.souvenir)
		id += "_SOUV";

	id = "price_" + id;

	let total = parseFloat((itemInfo[id] / 100).toFixed(2));

	if(item.stickers && item.stickers.length > 0) {
		for(let i = 0; i < item.stickers.length; i++) {
			total += exports.getItemPrice(item.stickers[i]);
		}
	}

	return total;
}

exports.upperWords = (input) => {
    let words = input.split(/(\s|-)+/),
        output = [];

    for (let i = 0, len = words.length; i < len; i += 1) {
        output.push(words[i][0].toUpperCase() +
                    words[i].toLowerCase().substr(1));
    }

    let name = output.join('');

    // manual fixes
    name = name.replace(/DDPAT/i, "DDPAT");	// fixes DDPAT
    name = name.replace(/in/i, "in");		// fixes in (as in Sun in Leo)

    return name;
}

exports.itemToImg = (item, size) => {
	let itemsListName = item.name.replace(/'/g, "&#39");
	if(item.float)
		itemsListName = `${itemsListName} (${helpers.floatToFullName(item.float)})`;

	if(item.rarity == 6 && !item.name.includes("Howl"))
		itemsListName = `★ ` + itemsListName;

	let name = itemsListName.toLowerCase();

	if(exports.itemsList[name]) {
		let img = exports.itemsList[name].icon_url_large;
		if(!img)
			img = exports.itemsList[name].icon_url;

		img += `/${size}fx${size}f`;

		return url.resolve("https://steamcommunity-a.akamaihd.net/economy/image/", img);
	}

	let upper = exports.upperWords(name);
	if(exports.itemsList[upper]) {
		let img = exports.itemsList[upper].icon_url_large;
		if(!img)
			img = exports.itemsList[upper].icon_url;

		img += `/${size}fx${size}f`;

		return url.resolve("https://steamcommunity-a.akamaihd.net/economy/image/", img);
	}

	console.log(`unknown image!`, item, itemsListName, name, upper, url.resolve("https://convars.com/case/", exports.items[item.name.toLowerCase()].imgs[helpers.floatToName(item.float)]));

	return url.resolve("https://convars.com/case/", exports.items[item.name.toLowerCase()].imgs[helpers.floatToName(item.float)]);
}

exports.lowerNameToItem = (lowerName) => {
	let type = null,
		family = null;

	lowerName = lowerName.toLowerCase();

	let item = exports.items[lowerName];

	if(!item)
		return null;

	if(lowerName.split(" | ").length > 1) {
		let tIndex = exports.types.map(s => s.toLowerCase()).indexOf(lowerName.split(" | ")[0]);
		type = exports.types[tIndex];

		let tFamily = exports.families.map(s => s.toLowerCase()).indexOf(lowerName.split(" | ").slice(1).join(" | "));
		family = exports.families[tFamily];

		if(!family) { // weapons not found in a container (awp | medusa)
			family = exports.upperWords(lowerName.split(" | ").slice(1).join(" | "));
		}
	}
	else {
		let tIndex =  exports.types.map(s => s.toLowerCase()).indexOf(lowerName);
		type = exports.types[tIndex];
	}

	let name = type;
	if(family)
		name += ` | ${family}`

	if(!item.rarity)
		item.rarity = 0;

	if(name == "M4A4 | Howl")
		item.rarity = 6;

	let unboxItem = {
		name: name,
		type: type,
		family: family,
		rarity: item.rarity,
		stickers: []
	};

	return unboxItem;
}

exports.finishItem = (unboxItem) => {
	let item = exports.items[unboxItem.name.toLowerCase()];

	if(item.minFloat || item.maxFloat) {
		let float = helpers.rngRangeFloat((item.minFloat || 0) / 100, (item.maxFloat || 100) / 100);
		unboxItem.float = float;
	}

	if(item.stattrak)
		unboxItem.statTrak = (Math.random() <= 0.1);
	else if(item.souvenir) {
		unboxItem.souvenir = true;
	}

	unboxItem.price = exports.getItemPrice(unboxItem);

	return unboxItem;
}

export default exports;