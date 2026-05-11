const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Routes
app.get('/', (req, res) => {
  res.send('Tomato API is running...');
});

// Get all restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get restaurant by ID with menu
app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const { data: restaurant, error: rError } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (rError) throw rError;

    const { data: menu, error: mError } = await supabase
      .from('food_items')
      .select('*')
      .eq('restaurant_id', req.params.id);
    
    if (mError) throw mError;

    res.json({ ...restaurant, menu });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Place an order
app.post('/api/orders', async (req, res) => {
  const { user_id, items, total_amount, address } = req.body;
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        { user_id, items, total_amount, address, status: 'pending' }
      ]);
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
