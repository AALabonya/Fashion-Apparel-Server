const express = require("express")
const cors =require("cors")
const data= require("./data.json")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.waps95s.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    // await client.connect();

     const fashionCollections = client.db("fashionBrandDB").collection("fashionCollections")
     const addToCart = client.db("fashionBrandDB").collection("addToCart")

app.get("/brands", (req, res)=>{
  res.send(data)
})

app.get("/product", async(req,res)=>{
    const cursor = fashionCollections.find()
    const result = await cursor.toArray()
    res.send(result)
})

app.get("/product/:id", async(req, res)=>{
    const id = req.params.id
    const query = {_id : new ObjectId(id)}
    const result = await fashionCollections.findOne(query)
    res.send(result)
})
app.post("/product", async(req, res)=>{
    const product = req.body 
    const result = await fashionCollections.insertOne(product)
    res.send(result)
})

app.put("/product/:id", async(req, res)=>{
  const id =req.params.id 
  const products = req.body
  const filter = {_id : new ObjectId(id)}
  const option ={upsert: true}
  const updateProduct ={
    $set:{
      name:products.name,
      image:products.image,
      brand:products.brand,
      type:products.type,
      price:products.price,
      rating:products.rating,
    }
  }
  const result = await fashionCollections.updateOne(filter, updateProduct,option)
  res.send(result)
})

app.get("/cart", async(req,res)=>{
  const cursor = addToCart.find()
  const result = await cursor.toArray()
  res.send(result)
})

app.post("/cart", async(req, res)=>{
  const cart = req.body 
  const result = await addToCart.insertOne(cart)
  res.send(result)
})

app.delete("/cart/:id", async(req, res)=>{
  const id = req.params.id
  const query ={_id : new ObjectId( id)}
  const result = await addToCart.deleteOne(query)
  res.send(result)
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req,res)=>{
    res.send("fashion-and-apparel-server-site")
})

app.listen(port, (req, res)=>{
    console.log(`fashion-and-apparel-server-site port,${port}`);
})