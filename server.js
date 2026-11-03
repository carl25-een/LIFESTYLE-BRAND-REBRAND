const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors()); // Allows your frontend to talk to this backend
app.use(express.json()); // Allows the backend to read JSON data

const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

app.get('/api/products', (req, res) => {
  const data = readData();
  res.json(data.products);
});

app.post('/api/products', (req, res) => {
  console.log("Backend received POST request:", req.body); // Debug log
  try {
    const data = readData();
    const newProduct = { id: Date.now(), ...req.body };
    data.products.push(newProduct);
    writeData(data);
    res.json({ message: "Product added!", product: newProduct });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ error: "Failed to save" });
  }
});

app.delete('/api/products/:id', (req, res) => {
  const data = readData();
  data.products = data.products.filter(p => p.id != req.params.id);
  writeData(data);
  res.json({ message: "Product deleted!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend API running on http://localhost:${PORT}`);
});