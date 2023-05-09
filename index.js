const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//! Midilwire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ccknyay.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const caffeCallection = client.db("caffeeDB").collection("caffee");

    //!Get all data
    app.get('/caffees', async(req,res)=>{
      const cursor = caffeCallection.find();
      const rusult = await cursor.toArray()
      res.send(rusult)
    })
    //! get single data
    app.get('/caffees/:id', async(req,res)=>{
      const id = req.params.id;
      const qurey = {_id: new ObjectId(id)}
      const rusult = await caffeCallection.findOne(qurey)
      res.send(rusult)
    })
    //!post data
    app.post('/caffees', async(req,res)=>{
      const newCaffee = req.body
      console.log(newCaffee);
      const rusult = await caffeCallection.insertOne(newCaffee);
      res.send(rusult);
    })
    //!delete data
    app.delete('/caffees/:id', async(req,res)=>{
      const id = req.params.id;
      const qurey = {_id: new ObjectId(id)}
      const rusult = await caffeCallection.deleteOne(qurey)
      res.send(rusult)
    })







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//! Main route
app.get("/", (req, res) => {
  res.send("Coffee Store Server is runnig...............!");
});

//! lisiter
app.listen(port, () => {
  console.log(`Coffee Store Server is runnig on ${port}`);
});
