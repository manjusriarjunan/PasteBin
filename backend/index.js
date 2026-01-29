require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const {CreatePaste,FetchPaste, ViewPasteHTML}= require("./contollers/paste");
const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/healthz", async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    return res.status(200).json({ ok: isConnected });
  } catch (error) {
    return res.status(200).json({ ok: false });
  }
});

app.post("/api/pastes",CreatePaste);
app.get("/api/pastes/:id",FetchPaste);
app.get("/p/:id", ViewPasteHTML);



const DatabaseConnection = async () =>{
    try {
    await mongoose.connect(process.env.MONGOURL);
    console.log(`Database ${mongoose.connection.name} is connected`);
    }
    catch(error){
        console.log("DB Connection failed",error);
    }
};

const PORT = process.env.PORT || 3000;
DatabaseConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n Server running on port ${PORT}`);
      console.log(`Health check: ${PORT}/api/healthz`);
      console.log(`TEST_MODE: ${process.env.TEST_MODE || '0'}\n`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });