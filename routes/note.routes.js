const express = require("express");
const noteRouter = express.Router();
const jwt = require("jsonwebtoken");

const { NoteModel } = require("../model/note.model");

noteRouter.get("/", async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "paprikey");

  try {
    if (decoded) {
      const notes = await NoteModel.find({ userID: decoded.userID });
      res.status(200).send(notes);
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

noteRouter.post("/add", async (req, res) => {
  try {
    const note = new NoteModel(req.body);
    await note.save();
    res.status(200).send({ msg: "A new note has been added" });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

noteRouter.patch("/update/:noteID", async (req, res) => {
  const { noteID } = req.params;
  const payload = req.body;
  try {
    await NoteModel.findByIdAndUpdate({ _id: noteID }, payload);
    res.status(200).send({ msg: "note details has been updated" });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

noteRouter.delete("/delete/:noteID", async (req, res) => {
  const { noteID } = req.params;
  try {
    await NoteModel.findByIdAndDelete({ _id: noteID });
    res.status(200).send({ msg: "note has been deleted" });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

module.exports = { noteRouter };
