const { supabase } = require('../database');

const createParticipant = async (req, res) => {
    try{
        const { data, error } = await supabase
            .from('tripParticipants')
            .insert(req.body)
            .select();

        if (error) return res.status(400).json({ error: error.message });
        return res.status(201).json(data);

    } catch(err){
        console.error('Server error: ', err);
        return res.sendStatus(500);
    }
}

const getParticipantByTripId = async (req, res) => {
    try{
        const { tripId } = req.params;
        const {data, error } = await supabase
         .from('tripParticipants')
         .select()
         .eq('trip', tripId);
        
        if (error) return res.status(400).json({ error: error.message});
        return res.status(200).json(data);

    } catch(err){
        console.error('Server error: ', err);
        return res.sendStatus(500);
    }
}

const deleteParticipant = async (req, res) => {
    try{
        const { tripId } = req.params;
        const { userId } = req.params;
        const {data, error } = await supabase
         .from('tripParticipants')
         .delete()
         .eq('trip', tripId)
         .eq('user', userId)
         .select();
        
        if (error) return res.status(400).json({ error: error.message});
        return res.status(200).json(data);

    } catch(err){
        console.error('Server error: ', err);
        return res.sendStatus(500);
    }
}

module.exports = {
    createParticipant,
    getParticipantByTripId,
    deleteParticipant,
}