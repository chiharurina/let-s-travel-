const { supabase } = require('../database');

const getAllTrips = async (req, res) => {
  try {
    const { data: trips, error } = await supabase.from('trips').select('');

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(trips);

  } catch (err) {
    console.error('Server error:', err);
    return res.sendStatus(500);
  }
}

const createTrip = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .insert(req.body)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
    
  } catch (err) {
    console.error('Server error:', err);
    return res.sendStatus(500);
  }
}

const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('trips')
      .select('')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: error.message });
    return res.json(data);

  } catch (err) {
    console.error('Server error:', err);
    return res.sendStatus(500);
  }
}


const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
     .from('trips')
     .update(req.body)
     .eq('id', id)
     .select();

    if (error) return res.status(404).json({ error: error.message});
    return res.status(200).json(data);

  } catch(err) {
    console.error('Server error:', err);
    return res.sendStatus(500);
  }
}

const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
     .from('trips')
     .delete()
     .eq('id', id)
     .select();

    if (error) return res.status(404).json({ error: error.message});
    return res.status(200).json(data);

  } catch(err) {
    console.error('Server error:', err);
    return res.sendStatus(500);
  }
}

module.exports = {
  getAllTrips,
  createTrip,
  getTripById,
  updateTrip,
  deleteTrip,
};