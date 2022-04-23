const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var eventSchema = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		date: {
			type: Date,
			required: true
		},
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Users",
			required: true
		},
		attendees: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Users"
			}
		],
	},
	{
		timestamps: true
	}
);
// Compile model from schema
var Events = mongoose.model("Events", eventSchema);
module.exports = Events;