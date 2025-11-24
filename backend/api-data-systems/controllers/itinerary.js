const { supabase } = require('../database');

const createItinerary = async (req, res) => {
    try{
        const { data, error } = await supabase
            .from('itinerary')
            .insert(req.body)
            .select();

        if (error) return res.status(400).json({ error: error.message });
        return res.status(201).json(data);

    } catch(err){
        console.error('Server error: ', err);
        return res.sendStatus(500);
    }
}

const getItineraryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('itineraryItems')
      .select('')
      .eq('itinerary', id);

    if (error) return res.status(404).json({ error: error.message });
    return res.status(200).json(data);

  } catch (err) {
    console.error('Server error:', err);
    return res.sendStatus(500);
  }
}

const createItineraryItem = async (req, res) => {
  try {      
      const { data, error } = await supabase
          .from('itineraryItems')
          .insert( req.body)
          .select();
      if (error) return res.status(400).json({ error: error.message });
      return res.status(201).json(data);

  } catch (err) {
    console.error('Server error:', err);
    return res.sendStatus(500);
  }
}


module.exports = {
    createItinerary,
    getItineraryById,
    createItineraryItem,
};