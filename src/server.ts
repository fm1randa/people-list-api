import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

type GroupType = {
	id: number;
	name: string;
};

type ToBeInsertedPerson = {
	name: string;
	age: number;
};

type InsertedPerson = {
	id: number;
	name: string;
	age: number;
	group: GroupType;
};

const list: InsertedPerson[] = [
	{ id: 1, name: 'Filipe', age: 20, group: defineGroup(20) },
	{ id: 2, name: 'Tiago', age: 11, group: defineGroup(11) },
];

let sequence = 3;

function defineGroup(age: number): GroupType {
	if (age >= 0 && age < 12) {
		return { id: 1, name: 'Criança' };
	}
	if (age >= 15 && age <= 19) {
		return { id: 3, name: 'Adolescente' };
	}
	if (age >= 20 && age <= 29) {
		return { id: 4, name: 'Jovem' };
	}
	if (age >= 30 && age < 65) {
		return { id: 5, name: 'Adulto' };
	}
	return { id: 6, name: 'Idoso' };
}

function nameNormalize(name: string): string {
	const nameArray = name.split(' ');
	const normalizedName = nameArray.reduce((prev, curr) => {
		return prev + curr.charAt(0).toUpperCase() + curr.slice(1) + ' ';
	}, '');
	return normalizedName;
}

app.post('/list', (req: Request, res: Response) => {
	try {
		const person = req.body as ToBeInsertedPerson;

		if (person.age >= 0) {
			list.push({
				id: sequence,
				name: nameNormalize(person.name),
				age: person.age,
				group: defineGroup(person.age),
			});
			sequence++;
			return res.status(200).send(list);
		}
		return res.status(500).send(`Invalid age!`);
	} catch (err) {
		res.status(500).send(`Error during person insertion: ${err}`);
	}
});

app.listen(3333, () => {
	console.log(`API is running @ localhost:${port}!`);
});
