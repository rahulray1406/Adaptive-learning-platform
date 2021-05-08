const mongoose = require("mongoose")
require("dotenv").config();
const db_url = process.env.DB_URL;
mongoose.connect(
    db_url,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    },
    function (err, link) {
        if (err)
            console.log(err);
        else
            console.log("db connect success...")
    }
)