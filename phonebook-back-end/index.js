const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan(":json"));

morgan.token("json", function (req, res) {
  return JSON.stringify({
    url: req.url,
    method: req.method,
    httpVersion: req.httpVersion,
    body: req.body,
  });
});

let contacts = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(contacts);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = contacts.find((contact) => contact.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const index = contacts.findIndex((contact) => contact.id === id);
  console.log(id, index);
  if (index > -1) {
    contacts.splice(index, 1);
    console.log(contacts);
    response.status(200).end();
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${contacts.length} people <br/> ${new Date()} </p>`);
});

app.post("/api/persons", (request, response) => {
  if (!request.body.name || !request.body.number) {
    response.status(300);
    response.json({ error: "name or number is missing" });
  }
  for (let contact of contacts) {
    if (contact.name === request.body.name) {
      response.status(300);
      response.json({ error: "name must be unique" });
    }
  }
  let maxId = contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) : 0;
  let person = request.body;
  person.id = maxId + 1;
  contacts = contacts.concat(person);
  response.json(person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
