const mongoose = require('mongoose');

mongoose
	.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((result) => console.log('Connected to database'))
	.catch((err) => console.log('Error Connecting to database: ', err));

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	number: {
		type: Number,
		required: true,
	},
});

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		console.log(document);
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Person', personSchema);
