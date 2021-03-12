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
  request.customer = costomer;
  return next();
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

app.get("/statement",verifyIfExistAccountCPF, (req, res) => {
  const { customer } = req;
  return res.json(customer);
});

app.listen(3003, () => {
  console.log("Started backend in port 3334!!");
});
