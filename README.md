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
{
    id: string,
    name: string,
    degree: number,
    review: stirng,
    amount: number,
    spirit: 'alpha' | 'lux'
}

GET     http://localhost:5000/vodka
        http://localhost:5000/vodka?degree=45&spirit=alpha&name=Tova...

POST    http://localhost:5000/vodka
body:   { name, degree, review, amount, spirit }

PUT     http://localhost:5000/vodka
body:   { id, name?, degree?, review?, amount?, spirit? }

DELETE  http://localhost:5000/vodka/:id
```
