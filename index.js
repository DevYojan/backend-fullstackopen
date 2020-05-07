const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3001;
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

app.listen(PORT);
