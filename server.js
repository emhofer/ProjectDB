const express = require('express');
const app = express();
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const DATA_FILE = 'data.json';

app.use(express.static('public'));
app.use(express.json());

// Get data from JSON file
function getData() {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
}

// Save data to JSON file
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Endpoint to get data
app.get('/api/data', (req, res) => {
    const data = getData();
    res.json(data);
});

// Endpoint to add data
app.post('/api/data', (req, res) => {
    const newData = req.body;
    const data = getData();
    data.push(newData);
    saveData(data);
    res.json(newData);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
