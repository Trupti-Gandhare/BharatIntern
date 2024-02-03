const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/Database')
var db = mongoose.connection
db.on('error', () => console.log("Error in Connecting to Database"))
db.once('open', () => console.log("Connected to Database"))

const expenseSchema = new mongoose.Schema({
  category: String,
  amount: Number,
  date: String,
});

const Expense = mongoose.model('Expense', expenseSchema);

app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/api/addExpense', async (req, res) => {
  const { category, amount, date } = req.body;

  try {
    const newExpense = new Expense({ category, amount, date });
    await newExpense.save();

    res.json({ success: true, expense: newExpense });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.get('/api/getExpenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json({ success: true, expenses });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.delete('/api/deleteExpense', async (req, res) => {
  const { _id } = req.body;

  try {
    const deletedExpense = await Expense.findByIdAndDelete(_id);

    if (deletedExpense) {
      res.json({ success: true });
    } else {
      res.json({ success: false, error: 'Expense not found' });
    }
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
