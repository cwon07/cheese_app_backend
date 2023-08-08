// IMPORT DEPENDENCIES
// reads .env file and creates environmental variables
require("dotenv").config();
//pulls PORT from .env, gives default value
// const PORT = process.env.PORT || 8000
const { PORT = 8000, DATABASE_URL } = process.env
// imports express
const express = require("express");
// creates application object
const app = express();
// imports mongoose
const mongoose = require("mongoose");
// import cors
const cors = require("cors");
// import morgan
const morgan = require("morgan");

// DATABASE CONNECTION
// Establish Connection
mongoose.connect(DATABASE_URL)

// Connection Events
mongoose.connection
    .on("open", () => console.log("You are connected to mongoose"))
    .on("close", () => console.log("You are disconnected from mongoose"))
    .on("error", (error) => console.log(error))

// MODELS
// models = PascalCase, singular "People"
// collections, tables = snake_case, plural "peoples"

const cheeseSchema = new mongoose.Schema({
    name: String,
    image: String,
    countryOfOrigin: String
})

const Cheese = mongoose.model("Cheese", cheeseSchema)

// MIDDLEWARE
// cors for preventing cors errors (allows all requests from other origins)
app.use(cors())
// morgan for logging requests
app.use(morgan("dev"))
// express functionality to recognize incoming request objects as JSON objects
app.use(express.json())

// ROUTES
// INDEX - GET - /cheese - gets all cheese
app.get("/cheese", async (req, res) => {
    try {
        // fetch all cheese from database
        const cheeses = await Cheese.find({});
        // send json of all cheese
        res.json(cheeses);
    } catch(error) {
        // send error as JSON
        res.status(400).json({error});
    }
});

// CREATE - POST - /cheese - adds a new cheese
app.post("/cheese", async (req, res) => {
    try {
        // create a new cheese
        const cheese = await Cheese.create(req.body)
        // send newly added cheese as JSON
        res.json(cheese)
    }
    catch(error){
        res.status(400).json({error})
    }
});

// SHOW - GET - /cheese/:id - get a single cheese
app.get("/cheese/:id", async (req, res) => {
    try {
        // get the single cheese
        const cheese = await Cheese.findById(req.params.id);
        // return the cheese as JSON
        res.json(cheese);
    } catch (error) {
        res.status(400).json({error});
    }
});

// UPDATE - PUT - /cheese/:id - update a single cheese
app.put("/cheese/:id",async (req, res) => {
    try {
        // update the cheese
        const cheese = await Cheese.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        // send the updated cheese as json
        res.json(cheese);
    } catch (error) {
        res.status(400).json({error});
    }
});

// DESTROY - DELETE - /cheese/:id - delete a single cheese
app.delete("/cheese/:id", async (req, res) => {
    try {
        // delete the cheese
        const cheese = await Cheese.findByIdAndDelete(req.params.id)
        // send the deleted cheese as json
        res.json(cheese);
    } catch (error) {
        res.status(400).json({error});
    }
});

// LISTENER
app.listen(PORT, () => console.log(`listening on port ${PORT}`));