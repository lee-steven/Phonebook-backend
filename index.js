const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())

morgan.token('object', function getObject(req, res){
    if(req.method === 'POST') return JSON.stringify(req.body)
    return ''
})
app.use(morgan(':method :url :status :res[content-length] :response-time ms :object'))
app.use(cors())


let persons = [
    {
        name: "Arto Hellas",
        number: "123-456-7890",
        id: 1,
    },
    {
        name: "Ada Lovelace",
        number: "234-567-8901",
        id: 2,
    },
    {
        name: "Dan Abramov",
        number: "345-678-9012",
        id: 3,
    },
    {
        name: "Mary Poppendick",
        number: "456-789-0123",
        id: 4,
    },
]

// Gets information regarding Phonebook
app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has information on ${persons.length} people</p>
        <p>${new Date()}</p>`
    )
})

// Gets all persons information that are a part of phonebook
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Gets person with specific id in phonebook
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        response.json(person)
    } else{
        response.status(404).end()
    }
})

// Deletes specific person from phonebook
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

// Adds person to phonebook
app.post('/api/persons', (request,response) => {
    const body = request.body
    let personExist = persons.find(person => person.name === body.name)

    if(!body.name){
        return response.status(400).json({ error: 'name or number missing'})
    } else if(!body.number){
        return response.status(400).json({ error: 'number missing'})
    } else if(personExist){
        return response.status(400).json({ error: 'Person already exists'})
    } 

    const newPerson = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random()*1000000000)
    }

    persons = persons.concat(newPerson)
    response.json(newPerson)
    console.log(persons)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})