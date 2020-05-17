require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const Person = require('./models/person');

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token('body', (req) => {
	if (req.method !== 'POST') {
		return null;
	}
	return JSON.stringify(req.body);
});

app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

const PORT = process.env.PORT;

app.get('/info', (req, res) => {
	// const personsLength = persons.length;
	// const summary = `Phonebook has info for ${personsLength} people.<br>${new Date()}`;
	Person.find({}, (err, docs) => {
		res.send(`Phonebook has info for ${docs.length} people.<br>${new Date()}`);
	});
});

app.get('/api/persons', (req, res) => {
	Person.find({}, (err, docs) => {
		res.json(docs.map((person) => person.toJSON()));
	});
});

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then((result) => {
			if (!result) {
				return res.status(404).end();
			}

			res.send(result.toJSON());
		})
		.catch((err) => next(err));
});

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndDelete(req.params.id)
		.then((result) => {
			if (!result) {
				return res.status(404).end();
			}

			res.status(204).end();
		})
		.catch((err) => next(err));
});

app.post('/api/persons', (req, res, next) => {
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

	const newPerson = new Person({
		name: person.name,
		number: person.number,
		date: new Date(),
	});

	newPerson
		.save()
		.then((savedPerson) => {
			res.status(201).json(savedPerson.toJSON());
		})
		.catch((err) => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body;

	Person.findByIdAndUpdate(
		req.params.id,
		{ $set: body },
		{
			new: true,
			runValidators: true,
			context: 'query',
		}
	)
		.then((result) => {
			res.json(result.toJSON());
		})
		.catch((err) => next(err));
});

app.use((err, req, res, next) => {
	if (err.name === 'CastError') {
		return res.status(400).send({ error: 'Malformatted id' });
	}

	if (err.name === 'ValidationError') {
		return res.status(400).json({ error: err.message });
	}

	next(err);
});

app.use((req, res) => {
	res.status(404).send({ error: 'Unknown endpoint' });
});

app.listen(PORT, () => {
	console.log('Listening on port', PORT);
});
