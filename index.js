const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

const app = express();

const vodkaKeys = ['id', 'name', 'degree', 'review', 'amount', 'spirit'];
let vodkas = [];

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(bodyParser.json());

app.get('/vodka', (req, res) => {
  res.status(200).send(JSON.stringify(vodkas));
});

app.delete('/vodka/:id', (req, res) => {
    let err;

    const id = req.params.id;
    if (!id) {
        err = new Error('Тут кстати айди нужно передать, чтобы норм было');
        err.statusCode = 500;
    }

    if (err) {
        res.status(500).send(err.message);
        return;
    }

    vodkas = vodkas.filter(vodka => vodka.id !== id);
    res.status(200).send('Deleted successfully');
});

app.post('/vodka', (req, res, next) => {
    let err;

    if (!req.body) {
        err = new Error('Body should not be empty');
        err.statusCode = 500;
    }

    const body = req.body;

    const {
        degree,
        amount,
        spirit,
    } = body;

    const bodyKeys = Object.keys(req.body).filter(key => key !== 'id');
    const vodkaKeysToChek = vodkaKeys.filter(key => key !== 'id');

    if (JSON.stringify(bodyKeys) !== JSON.stringify(vodkaKeysToChek)) {
        err = new Error('Игорь ты какую-то хуйню шлешь, побойся бога');
        next(err);
    } else if (Number.isNaN(Number(degree)) || Number.isNaN(Number(amount))) {
        err = new Error('Degree and amount should be numeric');
        next(err);
    } else if (spirit !== 'alpha' && spirit !== 'lux') {
        err = new Error('Spirit can be only \"alpha\" or \"lux\"');
        next(err);
    }

    if (err) {
        res.status(500).send(err.message);
        return;
    }

    vodkas.push({ ...body, id: String(Date.now()) });
    res.status(200).send('Dobavilos succesfully');
});

app.listen(PORT, () => console.log(`Well, hello there. We drink on port ${PORT}`));
