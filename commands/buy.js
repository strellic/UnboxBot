import userData from '../src/userData.js';
import csgoData from '../src/csgoData.js';

let exports = {};

exports.run = async (client, prefix, msg, args) => {
	let option = userData.get(msg.author.id, 'SHOP');

	if(!option) {
		return msg.reply(`please use ${prefix}shop to select a menu first.`);
	}

	if(!args[0] || isNaN(args[0]) || (args[1] && isNaN(args[1]))) {
		return msg.reply(`usage: ${prefix}buy <item number> [amount]`);
	}

	let item 	= parseInt(args[0]),
		amount 	= parseInt(args[1]) || 1;

	let user = await userData.getUser(msg.author);

	if(["CASES", "CASEKEYS", "COLLECTIONS", "TOURNCAPSULES"].includes(option)) {
		let type = null;

		if(["CASES", "CASEKEYS"].includes(option))
			type = csgoData.getCases()[item - 1];
		else if(option === "COLLECTIONS")
			type = csgoData.getCollections()[item - 1];
		else if(option === "TOURNCAPSULES")
			type = csgoData.getTournamentCapsules()[item - 1];

		if(!type) {
			return msg.reply(`invalid item number.`);
		}

		let price = 0;
		if(option === "CASES") {
			price = type.price * amount;
			if(price > user.money)
				return msg.reply(`you do not have enough money to buy **${amount}x ${type.name}** (**$${price.toFixed(2)}**)`);

			let index = -1;
			for(let i = 0; i < user.cases.length; i++) {
				if(user.cases[i].name === type.name) {
					index = i;
					user.cases[i].amount += amount;

					break;
				}
			}
			if(index == -1) {
				let caseObj = {
					name: type.name,
					amount: amount
				};
				user.cases.push(caseObj);
			}

			user.money -= price;

			await user.save();
			return msg.reply(`you bought **${amount}x ${type.name}** (**-$${price.toFixed(2)}**)`);
		}
		else if(option === "COLLECTIONS") {
			price = type.price * amount;
			if(price > user.money)
				return msg.reply(`you do not have enough money to buy **${amount}x ${type.name}** (**$${price.toFixed(2)}**)`);

			let index = -1;
			for(let i = 0; i < user.collections.length; i++) {
				if(user.collections[i].name === type.name) {
					index = i;
					user.collections[i].amount += amount;

					break;
				}
			}
			if(index == -1) {
				let colObj = {
					name: type.name,
					amount: amount
				};
				user.collections.push(colObj);
			}

			user.money -= price;

			await user.save();
			return msg.reply(`you bought **${amount}x ${type.name}** (**-$${price.toFixed(2)}**)`);
		}
		else if(option === "TOURNCAPSULES") {
			price = type.price * amount;
			if(price > user.money)
				return msg.reply(`you do not have enough money to buy **${amount}x ${type.name}** (**$${price.toFixed(2)}**)`);

			let index = -1;
			for(let i = 0; i < user.tournCapsules.length; i++) {
				if(user.tournCapsules[i].name === type.name) {
					index = i;
					user.tournCapsules[i].amount += amount;

					break;
				}
			}
			if(index == -1) {
				let cap = {
					name: type.name,
					amount: amount
				};
				user.tournCapsules.push(cap);
			}

			user.money -= price;

			await user.save();
			return msg.reply(`you bought **${amount}x ${type.name}** (**-$${price.toFixed(2)}**)`);
		}
		else if(option === "CASEKEYS") {
			price = type.keyPrice * amount;
			if(price > user.money)
				return msg.reply(`you do not have enough money to buy **${amount}x ${type.name}  Key** (**$${price.toFixed(2)}**)`);

			let index = -1;
			for(let i = 0; i < user.cases.length; i++) {
				if(user.cases[i].name === type.name) {
					index = i;
					user.cases[i].keys += amount;

					break;
				}
			}
			if(index == -1) {
				let caseObj = {
					name: type.name,
					keys: amount
				};
				user.cases.push(caseObj);
			}

			user.money -= price;

			await user.save();
			return msg.reply(`you bought **${amount}x ${type.name} Key** (**-$${price.toFixed(2)}**)`);
		}
	}

	return msg.reply(`there was an error processing your request.`);
}

exports.help = "Command to buy from the shop."

export default exports;