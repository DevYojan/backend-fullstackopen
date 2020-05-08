const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(cors());

morgan.token('body', function (req) {
	if (req.method !== 'POST') {
		return null;
	}
	return JSON.stringify(req.body);
});

app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

const PORT = process.env.PORT || 3001;
let persons = [
	{
		name: 'Barbara Deleon',
		number: '16',
		id: 1,
	},
	{
		name: 'adf',
		number: 'adfdf',
		id: 4,
	},
	{
		name: 'jhapa',
		number: '444',
		id: 5,
	},
	{
		name: 'larave',
		number: '5544',
		id: 6,
	},
	{
		name: 'bhatij',
		number: '4544',
		id: 7,
	},
	{
		name: 'yaaa',
		number: '3454',
		id: 8,
	},
	{
		name: 'kkl',
		number: '3433',
		id: 9,
	},
	{
		name: 'addssds`23`',
		number: 'q345435',
		id: 10,
	},
	{
		name: 'adfsf',
		number: '34534435',
		id: 11,
	},
];

const generateID = () => {
	const newID = Math.random() * 100000000;
	return Math.floor(newID);
};

const checkNameIsUnique = (name) => {
	const result = persons.find(
		(person) => person.name.toLowerCase() === name.toLowerCase()
	);
	if (result) {
		return false;
	}

	return true;
};

app.get('/info', (req, res) => {
	const personsLength = persons.length;
	const summary = `Phonebook has info for ${personsLength} people.<br>${new Date()}`;
	res.send(summary);
});

app.get('/api/persons', (req, res) => {
	res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
	const id = +req.params.id;
	const person = persons.find((person) => person.id === id);

	if (!person) {
		return res.status(404).end();
	}

	res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
	const id = +req.params.id;
	persons = persons.filter((person) => person.id !== id);
	res.status(204).end();
});

app.post('/api/persons', (req, res) => {
	const person = req.body;

	if (!person.name) {
		return res.status(400).json({
			error: 'name missing',
		});
	}

	if (!person.number) {
		return res.status(400).json({
			error: 'number missing',
		});
	}

	if (!checkNameIsUnique(person.name)) {
		res.status(400).json({
			error: 'name must be unique',
		});
	}

	const newPerson = {
		name: person.name,
		number: person.number,
		date: new Date(),
		id: generateID(),
	};

	persons = persons.concat(newPerson);
	res.json(newPerson);
});

app.listen(PORT);
