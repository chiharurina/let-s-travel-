// src/services/trips.js
import { get, post, put, del } from './api';

/**
 * Trips service - wrapper functions for /trips endpoints.
 * All functions are async and return the result from api helper.
 */

export async function getTrips() {
    try {
        const response = await get('/trips');
        return response;
    } catch (error) {
        console.error('getTrips error:', error);
        throw error;
    }
}

export async function getTripById(id) {
    try {
        const response = await get(`/trips/${id}`);
        return response;
    } catch (error) {
        console.error(`getTripById(${id}) error:`, error);
        throw error;
    }
}

export async function createTrip(tripData) {
    try {
        const response = await post('/trips', tripData);
        return response;
    } catch (error) {
        console.error('createTrip error:', error);
        throw error;
    }
}

export async function updateTrip(id, tripData) {
    try {
        const response = await put(`/trips/${id}`, tripData);
        return response;
    } catch (error) {
        console.error(`updateTrip(${id}) error:`, error);
        throw error;
    }
}

export async function deleteTrip(id) {
    try {
        const response = await del(`/trips/${id}`);
        return response;
    } catch (error) {
        console.error(`deleteTrip(${id}) error:`, error);
        throw error;
    }
}
