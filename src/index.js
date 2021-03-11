const express = require('express');
const {v4: uuidv4} = require('uuid')

const app = express();
const customers = []
app.use(express.json());

app.post('/account', (req, res) => {
  const {cpf, name} = req.body;
  if (customers.some((customer) => customer.cpf === cpf)) {
    return res.status(400).json({error: 'Customer already Exists!'})
  }

  const account = {cpf, name, id: uuidv4(), statement: []}
  customers.push(account);
  console.log(account)
  console.log(customers)
  return res.status(201).json(account);
});

app.listen(3003, () => {
  console.log('Started backend in port 3334!!')
});
