const { request } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const customers = [];
app.use(express.json());

const verifyIfExistAccountCPF = (req, res, next) => {
  const { cpf } = req.headers;
  const costomer = customers.find((costomer) => costomer.cpf === cpf);
  if (!costomer) return res.status(400).json({ error: "Customer not found" });
  req.customer = costomer;
  return next();
};

const getBalance = (statement) => {
  return statement.reduce((acc, operation) => {
    if (operation.type == "credit") {
      return acc + operation.amout;
    }
    return acc - operation.amout;
  }, 0);
};
app.post("/account", (req, res) => {
  const { cpf, name } = req.body;
  if (customers.some((customer) => customer.cpf === cpf)) {
    return res.status(400).json({ error: "Customer already Exists!" });
  }
  const account = { cpf, name, id: uuidv4(), statement: [] };
  customers.push(account);
  return res.status(201).json(account);
});

app.get("/statement", verifyIfExistAccountCPF, (req, res) => {
  const { customer } = req;
  return res.json(customer);
});

app.post("/deposit", verifyIfExistAccountCPF, (req, res) => {
  const { description, amount } = req.body;
  const { customer } = req;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };
  customer.statement.push(statementOperation);

  return res.status(201).send();
});

app.post("/withdraw", verifyIfExistAccountCPF, (req, res) => {
  const { amount } = req.body;
  const { customer } = req;
  const balance = getBalance(customer.statement);

  if (balance < amount)
    return res.status(400).json({ error: "Insufficient funds!" });
  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit",
  };
  customer.statement.push(statementOperation);
  return res.status(201).send();
});
app.listen(3003, () => {
  console.log("Started backend in port 3003!!");
});
