## Installation

```bash
npm i
```

## Run

```
npm run start
```

## Api
```
GET     http://localhost:5000/vodka

POST    http://localhost:5000/vodka
body: { name, degree, review, amount, spirit }

PUT     http://localhost:5000/vodka
body: { id, name?, degree?, review?, amount?, spirit? }

DELETE  http://localhost:5000/vodka/:id
```
