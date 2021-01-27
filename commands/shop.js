import helpers from '../src/helpers.js';
import csgoData from '../src/csgoData.js';
import userData from '../src/userData.js';

let exports = {};

exports.run = (client, prefix, msg, args) => {
	let embed = helpers.embed()
	.setTitle("Shop Menu");

	let options = [
		{reaction: "1️⃣", lock: msg.author.id, run: async (r, collectors, embedMsg, embed) => {
			await embedMsg.reactions.removeAll();
			for(let i = 0; i < collectors.length; i++)
				await collectors[i].stop();

			let caseEmbed = helpers.embed()
			.setTitle("Case Shop Menu")
			.setDescription("");

			let cases = csgoData.getCases();
			let desc = [];
			for(let i = 0; i < cases.length; i++) {
				desc.push(`**${prefix}buy ${i+1}** - **${cases[i].name}** ($${cases[i].price.toFixed(2)})`);
			}

			let chunkDesc = helpers.chunkArr(desc, 15);

			helpers.menuifyDescription(embedMsg, embed, chunkDesc, true, 1, msg.author.id);

			userData.set(msg.author.id, "SHOP", "CASES");
		}},
		{reaction: "2️⃣", lock: msg.author.id, run: async (r, collectors, embedMsg, embed) => {
			await embedMsg.reactions.removeAll();
			for(let i = 0; i < collectors.length; i++)
				await collectors[i].stop();

			let caseEmbed = helpers.embed()
			.setTitle("Case Shop Menu")
			.setDescription("");

			let cases = csgoData.getCases();
			let desc = [];
			for(let i = 0; i < cases.length; i++) {
				desc.push(`**${prefix}buy ${i+1}** - **${cases[i].name} Key** ($${cases[i].keyPrice})`);
			}

			let chunkDesc = helpers.chunkArr(desc, 15);

			helpers.menuifyDescription(embedMsg, embed, chunkDesc, true, 1, msg.author.id);
			userData.set(msg.author.id, "SHOP", "CASEKEYS");
		}},
		{reaction: "3️⃣", lock: msg.author.id, run: async (r, collectors, embedMsg, embed) => {
			await embedMsg.reactions.removeAll();
			for(let i = 0; i < collectors.length; i++)
				await collectors[i].stop();

			let caseEmbed = helpers.embed()
			.setTitle("Collection Shop Menu")
			.setDescription("");

			let collections = csgoData.getCollections();
			let desc = [];
			for(let i = 0; i < collections.length; i++) {
				desc.push(`**${prefix}buy ${i+1}** - **${collections[i].name}** ($${collections[i].price})`);
			}

			let chunkDesc = helpers.chunkArr(desc, 15);

			helpers.menuifyDescription(embedMsg, embed, chunkDesc, true, 1, msg.author.id);
			userData.set(msg.author.id, "SHOP", "COLLECTIONS");
		}},
		{reaction: "4️⃣", lock: msg.author.id, run: async (r, collectors, embedMsg, embed) => {
			await embedMsg.reactions.removeAll();
			for(let i = 0; i < collectors.length; i++)
				await collectors[i].stop();

			let caseEmbed = helpers.embed()
			.setTitle("Tournament Sticker Capsules Shop Menu")
			.setDescription("");

			let capsules = csgoData.getTournamentCapsules();
			let desc = [];
			for(let i = 0; i < capsules.length; i++) {
				desc.push(`**${prefix}buy ${i+1}** - **${capsules[i].name}** ($${capsules[i].price})`);
			}

			let chunkDesc = helpers.chunkArr(desc, 15);

			helpers.menuifyDescription(embedMsg, embed, chunkDesc, true, 1, msg.author.id);
			userData.set(msg.author.id, "SHOP", "TOURNCAPSULES");
		}}
	];

	embed.setDescription(`1️⃣  - Cases\n2️⃣  - Case Keys\n3️⃣ - Collections\n 4️⃣ - Tournament Sticker Capsules`);

	helpers.menuify(msg, embed, options);
}

exports.help = "Shows the shop menu.";

export default exports;