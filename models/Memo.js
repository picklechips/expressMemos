const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemoSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	details: {
		type: String,
		required: true
	},
	date: {
		type: String,
		default: Date.now
	},
	user: {
		type: String,
		required: true
	}
})

mongoose.model('memos', MemoSchema);