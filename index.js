// const Joi = require("joi");
// Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();
const path = require("path");
// const config = require("config");

// const cors = require("cors");
const bodyParser = require("body-parser");
// const helmet = require("helmet");
const mongoose = require("mongoose");
const apiRouter = require("./routes/auth");
const problem = require("./routes/problem");
const tags = require("./routes/tags");
const question = require("./models/question");

// if (process.env.NODE_ENV !== "production") {
// const morgan = require("morgan");
// app.use(morgan("dev"));
// require("dotenv").config();
// }

// app.use(helmet());
// app.use(helmet.hidePoweredBy());
// app.use(cors());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
// app.set("trust proxy", 1);
app.use("/api/problem", problem);
app.use("/api/tags", tags);
app.use("/api", apiRouter);

app.post("/getAllProblems", async (req, res) => {
    // console.log(req.body.tag);
    // const data = await question.find({
    //     tags: {
    //         $all: req.body.tag
    //     }
    // })

    // // console.log(data)
    // res.send(data)

    let {author, concept} = req.body;

    if (typeof(author) === "string") {
        author = [author];
    }
    if (typeof(concept) === "string") {
        concept = [concept];
    }

    if (typeof(author) === "undefined") {
        author = []
    }
    if (typeof(concept) === "undefined") {
        concept = []
    }

    let tags = [
        ...author,
        ...concept
    ]

    console.log(tags);
    const data = await question.find({
        tags: {
            $all: tags
        }
    })

    res.render("allproblem", {data})
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