const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 5000;
var path = require("path");

// DB CONNECTION CODE START
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost/FSDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to database");
});
const tbRowSchema = new Schema({
  rowData: String,
});
const tbRowModel = mongoose.model("tbRow", tbRowSchema);
// const tbRow1 = new tbRowModel({ rowData: "Row 1" });
// const tbRow2 = new tbRowModel({ rowData: "Row 2" });

// tbRow1.save((err, result) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(result);
//   }
// });
// tbRow2.save((err, result) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(result);
//   }
// });

// DB CONNECTION CODE END

app.use(cors());
app.options("*", cors());
// let assetsPath = path.join(__dirname, "../Frontend/static");
// app.use("/static", express.static(assetsPath));
app.get("/FStable", (req, res) => {
  //   res.sendFile("index.html", { root: path.join(__dirname, "../Frontend") });
  var ans = [];
  tbRowModel.find({}, (err, result) => {
    // console.log('THis is IN DB')
    // console.log(res.length)
    if (!err) {
      res.send({ exp: "FS TABLE", tableData: result });
    }
  });
  //   console.log("SEnding THIS DATA", ans);

  //   console.log("Received Get Request " + assetsPath);
});

app.post("/FStable", (req, res) => {
  console.log("POSTREQ", req.body.inputData);
  const tbRow = new tbRowModel({ rowData: req.body.inputData });
  tbRow.save((err, result) => {
    if (err) {
      console.log(err);
      res.send(false);

    } else {
      console.log(result);
      res.send(true);
    }
  });
});

app.delete("/FStable",(req,res)=>{
    console.log(req.body.id)
    tbRowModel.findByIdAndDelete(req.body.id,{},(err,doc,result)=>{
        if(err){res.send(false);console.log(err)}
        else {res.send(true);console.log("ITEM DELETED")}
    })
})

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
