const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose
	.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => console.log('Connected to database'))
	.catch((err) => console.log('Error Connecting to database: ', err));

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		uniqueCaseInsensitive: true,
		minlength: 3,
	},
	number: {
		type: Number,
		required: true,
		min: 10000000,
	},
});

personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		console.log(document);
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Person', personSchema);
