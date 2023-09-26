const notesService = require("./notes-service");

// Setting up Express server
const express = require("express");
const app = express();
app.use(express.json());
const port = 3002;
const url = "http://localhost:" + port;

app.listen(port, () => {
  console.log("The server is running at " + url);
});

//=============================================================

//  POST : adds a new note

app.post("/notes", async (req, res) => {
  // return an error if the note field is empty
  console.log(req.body);
  if (req.body.notes === undefined) {
    return res
      .status(400)
      .send("The note field is empty so a note was not sent (つ﹏<。)");
  }

  // Saving our new note into our database
  try {
    const result = await notesService.createNewNote(req);
    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send("An error occurred so a note was not posted ( ఠ్ఠᗣఠ్ఠ )");
  }
});

// ------------------------------------------------------------
//  GET : will show us all current notes in our database

app.get("/notes", async (req, res) => {
  try {
    allNotes = await notesService.getAllNotes();
    console.log(allNotes);
    return res.status(200).send(allNotes);
  } catch (error) {
    return res
      .status(500)
      .send("An error has occurred - Database can't be shown (⋟﹏⋞)");
  }
});

// ------------------------------------------------------------

// GET BY ID: /notes/[id] returns based on id

app.get("/notes/:_id", async (req, res) => {
  const noteById = await notesService.getById(res, req.params._id);

  if (noteById === null) {
    return res.status(404).send("There is no entry with this id ( ＞Д＜ )ゝ");
  } else {
    return res.send(noteById);
  }
});

// ------------------------------------------------------------

// UPDATE BY ID: /update/[id] changes the note for that entry

app.patch("/notes/:_id/", async (req, res) => {
  const noteById = await notesService.getById(res, req.params._id);

  if (noteById === null) {
    return res.status(404).send("There is no entry with this id ( ＞Д＜ )ゝ ");
  } else {
    try {
      await notesService.updateById(req.params._id, {
        notes: req.body.notes,
      });
      return res
        .status(200)
        .send("this note has been updated successfully ٩(`･ω･´)و");
    } catch (error) {
      return res
        .status(500)
        .send(
          "An error has occurred - not was not updated (⋟﹏⋞) - this is possibly a server error"
        );
    }
  }
});
//------------------------------------------------------------

// DELETE BY ID: /delete/[id] deleted that id entry

app.delete("/notes/:_id", async (req, res) => {
  //const noteById = await Note.findById(req.params).exec();
  const noteById = await notesService.getById(res, req.params._id);

  if (noteById === null) {
    return res.status(404).send("There is no entry with this id ( ＞Д＜ )ゝ ");
  } else {
    try {
      await notesService.delById(req.params);
      return res
        .status(200)
        .send("this note has been deleted successfully deleted ٩(`･ω･´)و");
    } catch (error) {
      return res
        .status(500)
        .send(
          "An error has occurred - this note was note deleted (⋟﹏⋞)- Possible server error"
        );
    }
  }
});

// DELETE ALL: /delete/all deleted all notes

app.delete("/notes/", async (req, res) => {
  try {
    await notesService.deleteAllNotes();
    return res.status(200).send("All notes have been deleted ٩(`･ω･´)و");
  } catch (error) {
    return res
      .status(500)
      .send("An error has occurred - all notes where note deleted (⋟﹏⋞)");
  }
});

module.exports = app;