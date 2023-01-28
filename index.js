const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3njemyu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function run() {
    try {
        const Users_Collection = client.db("Information").collection("data");
        const Select_box = client.db("Information").collection("selectbox");


        app.get('/select_options', async (req, res) => {
            const box = await Select_box.find({}).toArray();
            res.send(box);
        });

        app.get('/users', async (req, res) => {
            const users = await Users_Collection.find({}).toArray();
            res.send(users);
        });

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const user = await Users_Collection.findOne({ _id: ObjectId(id) });
            res.send(user);
        });

        // app.patch('/edit/:id', async (req, res) => {
        //     const query = { _id: ObjectId(req.params.id) };
        //     const updateDoc = { $set: { status: req.body.status } };
        //     console.log(req.body.status)
        //     const result = await order_Collection.updateOne(query, updateDoc);
        //     res.send(result);
        // });

        app.patch('/edit_user/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const updateDoc = { $set: { name: req.body.name, select: req.body.select } };
            const result = await Users_Collection.updateOne(query, updateDoc);
            res.send(result);
        })

        app.post('/add_user', async (req, res) => {
            const user = req.body;
            const result = await Users_Collection.insertOne(user);
            res.json(result);
        });

    }
    finally {

    }
}

run();




app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});