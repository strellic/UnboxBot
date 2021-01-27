import helpers from '../src/helpers.js';
import userData from '../src/userData.js';

let exports = {};

exports.run = async (client, prefix, msg, args) => {
	let embed = helpers.embed()
	.setTitle("Inventory");

	let lines = [];
	let user = await userData.getUser(msg.author);

	let cases = user.cases;
	let collections = user.collections;
	let tournCapsules = user.tournCapsules;

	cases = cases.filter(obj => obj.amount !== 0 || obj.keys !== 0);
	user.cases = cases;

	collections = collections.filter(obj => obj.amount !== 0)
	user.collections = collections;

	await user.save();

	if(cases) {
		for(let i = 0; i < cases.length; i++) {
			let caseObj = cases[i];
			lines.push(`**${caseObj.name}** (**x${caseObj.amount}**): **${caseObj.keys} keys**`);
		}
	}
	if(collections) {
		for(let i = 0; i < collections.length; i++) {
			let colObj = collections[i];
			lines.push(`**${colObj.name}** (**x${colObj.amount}**)`);
		}
	}
	if(tournCapsules) {
		for(let i = 0; i < tournCapsules.length; i++) {
			let cap = tournCapsules[i];
			lines.push(`**${cap.name}** (**x${cap.amount}**)`);
		}
	}

	let chunkLines = helpers.chunkArr(lines, 15);
	helpers.menuifyDescription(msg, embed, chunkLines);
}

exports.help = "Shows all items.";

export default exports;