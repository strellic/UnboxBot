import mongoose from 'mongoose';
const Schema    = mongoose.Schema;

const userSchema = Schema({
	id: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true,
		default: "UNKNOWN"
	},
	avatar: {
		type: String,
		default: "UNKNOWN"
	},
	money: {
		type: Number,
		default: 0
	},
	lastDaily: {
		type : Date, 
		default: 0
	},
	lastDrop: {
		type : Date, 
		default: 0
	},
	cases: [{
		name: {
			type: String,
			required: true
		},
		amount: {
			type: Number,
			default: 0
		},
		keys: {
			type: Number,
			default: 0
		}
	}],
	collections: [{
		name: {
			type: String,
			required: true
		},
		amount: {
			type: Number,
			default: 0
		},
	}],
	tournCapsules: [{
		name: {
			type: String,
			required: true
		},
		amount: {
			type: Number,
			default: 0
		},
	}],
	items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
	lastItem: {
		type: Number,
		default: 0
	}
});

userSchema.pre('save', function(next) {
	this.money = parseFloat(this.money.toFixed(2));
	next();
});

export default mongoose.model('User', userSchema);