const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET","POST","PATCH","DELETE"]
}));
app.use(express.json());

const sampleFile = "./sample.json";

// Always read latest users
const getUsers = () => {
  const data = fs.readFileSync(sampleFile, "utf8");
  return JSON.parse(data);
};

// GET all users
app.get("/users", (req, res) => {
  const users = getUsers();
  res.json(users);
});

// DELETE user
app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  let users = getUsers();

  // Check if user exists
  const userExists = users.some(u => u.id === id);
  if (!userExists) {
    return res.status(404).json({ error: "User not found" });
  }

  const filteredUsers = users.filter(u => u.id !== id);

  // Write updated array to file
  fs.writeFile(sampleFile, JSON.stringify(filteredUsers, null, 2), (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).json({ error: "Failed to delete user" });
    }

    console.log(`✅ User with ID ${id} deleted`);
    res.json(filteredUsers); // Send updated users to frontend
  });
});

app.listen(8000, () => console.log("✅ Server running on port 8000"));
