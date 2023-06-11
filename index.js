const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
    res.send('server is running');
})


// Cc7Ebl2uR91MQ88n
// goclick

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gplljg9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productCollection = client.db("goclick").collection("products");


        app.post('/product', async (req, res) => {
            const data = req.body;
            const result = await productCollection.insertOne(data);
            res.send(result);
        });

        app.get('/product', async (req, res) => {
            const query = {};
            const result = await productCollection.find(query).toArray();
            res.send(result);
        });

        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const formData = req.body;

            const query = { orderid: id };
            // console.log(query);
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ...formData,
                    price: formData.price,
                },
            };
            const result = await productCollection.updateOne(query, updateDoc, options);
            // res.send(query);
            res.send(result);
        });

        app.get('/product/search', async (req, res) => {
            const searchTerm = req.query.term;
            const regex = new RegExp(searchTerm, 'i');
            const searchData = await productCollection
            .find({
                $or: [
                  { orderid: regex },
                  { from: regex },
                  { to: regex },
                ]
              })
            .toArray();
            console.log(searchData);
            res.json(searchData);
        });



    }
    finally {

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Listening to the port ${port}`);
})
