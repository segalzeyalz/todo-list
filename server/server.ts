import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = 3000;

app.use(express.json());

interface ITask {
  _id?: string;
  description: string;
  isDone: boolean;
  isEditMode: boolean;
}

const client = new MongoClient("mongodb://localhost:27017", {
});

// Connect to the MongoDB server
client.connect((error) => {
  if (error) {
    console.log(error);
    process.exit(1);
  }

  const db = client.db("todo");
  const tasks = db.collection<ITask>("tasks");

  // Get all tasks
  app.get("/tasks", async (request: Request, response: Response) => {
    try {
      const allTasks = await tasks.find({}).toArray();
      response.status(200).json(allTasks);
    } catch (error) {
      response.status(500).json({ error });
    }
  });

  // Create a new task
  app.post("/tasks", async (request: Request, response: Response) => {
    const { description } = request.body;
    const newTask: ITask = {
      _id: uuidv4(),
      description,
      isDone: false,
      isEditMode: false,
    };

    try {
      const result = await tasks.insertOne(newTask);
      response.status(201).json(result);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  });

  // Update a task
  app.put("/tasks/:id", async (request: Request, response: Response) => {
    const { id } = request.params;
    const { description, isDone, isEditMode } = request.body;
    const updatedTask: ITask = { description, isDone, isEditMode };

    try {
      const result = await tasks.updateOne({ _id: id }, { $set: updatedTask });
      if (result.modifiedCount === 0) {
        response.status(404).json({ message: "Task not found" });
        return;
      }
      response.status(200).json({ message: "Task updated" });
    }

    catch (error) {
      response.status(500).json({ error: error.message });
    }
  });

  // Mark a task as done
app.patch("/tasks/:id/done", async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
      const result = await tasks.updateOne({ _id: id }, { $set: { isDone: true } });
      if (result.modifiedCount === 0) {
        response.status(404).json({ message: "Task not found" });
        return;
      }
      response.status(200).json({ message: "Task marked as done" });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  });

app.delete("/tasks/:id", async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
      const result = await tasks.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        response.status(404).json({ message: "Task not found" });
        return;
      }
      response.status(200).json({ message: "Task deleted" });
    } catch (error) {
      response.status(500).json({ error});
    }
  });

})
