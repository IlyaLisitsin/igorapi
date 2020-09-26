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

app.delete('/vodka/:id', (req, res, next) => {
    let err;

    const id = req.params.id;
    if (!id) {
        err = new Error('Тут кстати айди нужно передать, чтобы норм было');
    }

    if (err) {
        next(err);
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

    const bodyKeys = Object.keys(req.body).filter(key => key !== 'id').sort();
    const vodkaKeysToChek = vodkaKeys.filter(key => key !== 'id').sort();

    if (JSON.stringify(bodyKeys) !== JSON.stringify(vodkaKeysToChek)) {
        err = new Error('Игорь ты какую-то хуйню шлешь, побойся бога');
    } else if (Number.isNaN(Number(degree)) || Number.isNaN(Number(amount))) {
        err = new Error('Degree and amount should be numeric');
    } else if (spirit !== 'alpha' && spirit !== 'lux') {
        err = new Error('Spirit can be only \"alpha\" or \"lux\"');
    }

    if (err) {
        next(err);
        return;
    }

    vodkas.push({ ...body, id: String(Date.now()) });
    res.status(200).send('Dobavilos succesfully');
});

app.put('/vodka', (req, res, next) => {
    let err;

    const body = req.body;

    if (!req.body) {
        err = new Error('Body should not be empty');
        err.statusCode = 500;
    }

    const {
        id,
        degree,
        amount,
        spirit,
    } = body;

    const vodkaToChangeIndex = vodkas.findIndex(vodka => vodka.id === String(id));
    const bodyKeys = Object.keys(req.body);

    let isAllBodyKeysInVodkaKeys = true;
    for (let key in bodyKeys) {
        if (!vodkaKeys[key]) isAllBodyKeysInVodkaKeys = false;
    }

    if (!isAllBodyKeysInVodkaKeys) {
        err = new Error('Игорь ты какую-то хуйню шлешь, побойся бога');
    } else if ((degree && Number.isNaN(Number(degree))) || (amount && Number.isNaN(Number(amount)))) {
        err = new Error('Degree and amount should be numeric');
    } else if ((spirit && spirit !== 'alpha') && (spirit && spirit !== 'lux')) {
        err = new Error('Spirit can be only \"alpha\" or \"lux\"');
    } else if (!vodkas[vodkaToChangeIndex]) {
        err = new Error('There is no item with such id');
    }

    if (err) {
        next(err);
        return;
    }

    Object.keys(body).forEach(key => vodkas[vodkaToChangeIndex][key] = body[key]);

    res.status(200).send('Updated succesfully');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.message);
});

app.listen(PORT, () => console.log(`Well, hello there. We drink on port ${PORT}`));
