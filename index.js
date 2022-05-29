const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const tags = require("./routes/tags");
const problems = require("./routes/problem");
const tag = require("./models/tag");


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: false}))


app.use("/home",tags);
app.use("/problems",problems)

app.get("/searchTag",async (req,res)=>{
    const value = req.query.value
    const data = await tag.find({
        tag: {
            $regex: value,
            $options: "$i"
        }
    }, {
        _id: 0,
        tag: 1
    }).limit(10);

    res.send(data)
})
app.post("/addNewTag/:problemId",async(req,res)=>{
  console.log(req.params.problemId,req.body.newTag);
  res.send("Hii")
})

// if (process.env.NODE_ENV === "production") {
// app.use(compression());
// app.use(express.static(path.join(__dirname, "client/build")));

// app.get("*", function (req, res) {
//     res.sendFile(path.join(__dirname, "client/build", "index.html"));
// });
// }

app.use((err, req, res, next) => {
    if (!err.statusCode) {
        err.statusCode = 500;
        console.log(err);
    }
    console.log(err.message);
    res.status(err.statusCode).send({
        error: err.statusCode >= 500 ? "An unexpected error ocurred, please try again later." : err.message
    });
});

(async function () {
    try {
        await mongoose.connect("mongodb+srv://mukul:mukul@mukul.lcc65.mongodb.net/codechef?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("Connected to database");
    } catch (err) {
        throw new Error(err);
    }
})();

const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`Listening on port ${port}...`));


// Complete getting tags(user defined tags) , selection of multiple tags , searching problems based on multiple tags
// Authentication integrate , show form for new tag should only be shown to logged in user