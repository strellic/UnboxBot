import mongoose from 'mongoose';
const Schema    = mongoose.Schema;

const itemSchema = Schema({
	id: {
		type: Number,
		required: true
	},
	owner: { // not required bc of stickers in the future :)
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	name: {
		type: String,
		required: true
	},
	type: { // m4a4, awp, sticker, pin, etc
		type: String,
	},
	family: { // howl, dragon lore, player name, etc
		type: String
	},
	float: { // only for skins
		type: Number,
	},
	rarity: {
		type: Number,
		required: true,
	},
	statTrak: {
		type: Boolean,
		default: false
	},
	souvenir: {
		type: Boolean,
		default: false
	},
	nickName: {
		type: String
	},
	stickers: [{
		type: Schema.Types.ObjectId,
		ref: 'Item',
	}],
	favorite: {
		type: Boolean,
		default: false
	}
});

export default mongoose.model('Item', itemSchema);