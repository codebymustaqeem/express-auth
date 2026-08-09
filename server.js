

require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});


app.use("/api/auth", authRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Users are stored in memory only — they reset when the server restarts.`);
});
