const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
const http = require('http');
const { Server } = require('socket.io');

app.use(cors())
app.use(express.json())



const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

// Add this
// Listen for when the client connects via socket.io-client
io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    // We can write our socket event listeners in here...
    
    
});



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://taskProject:w2ER3QOfrqlZfrT4@cluster0.bitxn0d.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        const users = client.db("socket-practice").collection("socket-users");
        // const changeStream = users.watch();

        // changeStream.on('change', (change) => {
        //     // Emit a change event to connected clients
        //     io.emit('databaseChange', change);
        // });

        app.post('/addUser', async (req, res) => {
            const user = req.body;
            const result = await users.insertOne(user);
            io.emit('databaseChange', user);
            res.send(result);
        });
        app.get('/users', async (req, res) => {
            const cursor = users.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

server.listen(port)