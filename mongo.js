const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log('Password is required to access database');
	process.exit(1);
}

const password = process.argv[2];
mongoose.connect(
	`mongodb+srv://yojan:${password}@cluster0-je1im.mongodb.net/test?retryWrites=true&w=majority`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	number: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		required: true,
		default: new Date(),
	},
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
	Person.find({}).then((persons) => {
		console.log('Phonebook:');
		persons.forEach((person) => console.log(`${person.name} ${person.number}`));
		mongoose.connection.close();
	});
}

if (process.argv.length === 5) {
	const [name, number] = process.argv.slice(3);
	const newPerson = new Person({
		name,
		number,
	});
	newPerson.save().then((result) => {
		console.log(result);
		mongoose.connection.close();
	});
}

if (process.argv.length === 4) {
	console.log('Please provide phone number');
	mongoose.connection.close();
}
