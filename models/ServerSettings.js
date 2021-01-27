import mongoose from 'mongoose';
const Schema    = mongoose.Schema;

const serverSettingsSchema = Schema({
	id: {
		type: Number,
		required: true
	},
    prefix: String,
});

export default mongoose.model('ServerSettings', serverSettingsSchema);