require('dotenv').config()
const cors = require('cors')

const express = require("express");
const morgan = require('morgan')
const Entry = require('./models/phoneBookEntry.js')
const app = express();



app.use(express.json())

app.use(cors())
app.use(express.static('dist'))


morgan.token('bodyData', function (req, res) { 
    return JSON.stringify(req.body)  
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyData'))

const persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]


app.get("/api/persons", (request, response) => {
    Entry.find({}).then(persons => {
        response.json(persons)
    })
    //response.json(persons);
})

app.get("/api/persons/:id", (request, response, next) => {
    Entry.findById(request.params.id).then(entry => {
        if (entry) {
            response.json(entry)
        }
        else {
            response.status(404).end();
        }
    })
    .catch(error => next(error))
    
})

app.delete("/api/persons/:id", (request, response, next) => {
    Entry.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
    
})

app.post("/api/persons", (request, response, next) => {
    const body = request.body;

    const entry = new Entry({
        name: body.name,
        number: body.number,
    })

    entry.save().then(savedEntry => {
        response.status(201);
        response.json(savedEntry)
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
    const {name, number} = request.body;

    if (!name) {
        response.status(400)
        response.json({error: "no name in the request"})
        return;
    }

    if (!number ) {
        response.status(400)
        response.json({error: "no number in the request"})
        return;
    }

    Entry.findById(request.params.id)
    .then(entry => {
      if (!entry) {
        return response.status(404).end()
      }

      entry.name = name
      entry.number = number

      return entry.save().then((updatedEntry) => {
        response.json(updatedEntry)
      })
    })
    .catch(error => next(error))
})



app.get("/info", (request, response) => {
    
    
    Entry.find({}).then(persons => {
        const date = new Date();
        response.send(`Phonebook has info for ${persons.length} people <br> ${date}`);
    })
})



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})