import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
import Task from './models/Task.js';
import cors from 'cors';

mongoose.connect(process.env.DATABASE_URL).then(() => console.log("Connected to DB"));

const app = express();

app.use(cors());
app.use(express.json());

function asyncHandler(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch(e) {
      if(e.name === "CastError") res.status(404).send({ message: "Connot find given id" });
      else if(e.name === "ValidationError") res.status(400).send({ message: e.message });
      else res.status(500).send({ message: e.message });
    }
  }
}

app.get('/tasks', asyncHandler(async (req, res) => {
  const sort = req.query["sort"];
  const count = Number(req.query["count"]) || 0;

  const sortOption = {
    createdAt: sort === "oldest" ? 'asc' : 'desc'
  }
  const task = await Task.find().sort(sortOption).limit(count);

  res.send(task);
}));
app.get('/tasks/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const task = await Task.findById(id);

  if(task) res.send(task);
  else res.status(404).send({ message: "Connot found given id. "});
}));

app.post('/tasks', asyncHandler(async (req, res) => {
  const newTask = await Task.create(req.body);

  res.status(201).send(newTask);
}));

app.patch('/tasks/:id', asyncHandler(async (req, res) => {
  const id = req.params["id"];
  const task = await Task.findById(id);

  if(task) {
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    });
    await task.save();
    res.send(task);
  } else res.status(404).send({ message: "Cannot find given id." });
}));

app.delete('/tasks/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const task = await Task.findByIdAndDelete(id);

  if(task) res.sendStatus(204);
  else res.status(404).send({ message: "Connot found given id. "});
}));


app.listen(process.env.PORT || 3000, () => console.log('Server Started'));