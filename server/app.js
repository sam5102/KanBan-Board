let express  = require('express');
let app = express();
let cors = require('cors');
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;

let mongoURL = "mongodb+srv://test:test@cluster0.o0pdq4c.mongodb.net/?retryWrites=true&w=majority"
let port = process.env.PORT || 9500
let bodyParser = require("body-parser")
let db = null;

// middleware (supporting library)
app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) =>{
    res.send('<h1>Welcome To Sam Server</h1>');
}) 

//fetching all tasks
app.get('/getAllTasks', (req, res) =>{
    db.collection('tasks').find().toArray((err, result) => {
        if(err) throw err;
        res.send(result)
    })
}) 

//adding tasks
app.post('/todo', async (req, res) => {
    await db.collection('tasks').insertOne(req.body, (err, result) => {
        if(err) throw err;
        res.send('Task added in todo list')
    })
})

//updating tasks
app.put('/update/:id', async (req, res) => {
  const documentId = req.params.id;
  const updatedData = req.body;
  console.log('updated data: ', updatedData, documentId)
  const result = db.collection('tasks').updateOne({_id: new mongo.ObjectId(documentId)}, {$set: updatedData}, (err, result) => {
      if(err) throw err;
      res.send('Task updated successfully')
  })
})

//deleting particular tasks
app.delete('/delete/:id', async (req, res) => {
    const documentId = req.params.id;

    const query = {_id: new mongo.ObjectId(documentId)}
    const result = db.collection('tasks').deleteOne(query, (err, result) => {
        if(err) throw err;
        res.send('Task deleted successfully')
    })
})


//connect with mongodb
MongoClient.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    if (err) console.log('Error while connecting to Mongo');
    db = client.db('Blackcoffer');
    app.listen(port, () => {
        console.log('Server is running on port ' + port);
    })
})
