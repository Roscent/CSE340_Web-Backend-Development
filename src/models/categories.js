import db from './db.js';

/**
 * Retrieves all categories from the database ordered alphabetically
 */
async function getAllCategories() {
    const queryText = 'SELECT category_id, name FROM category ORDER BY name ASC;';
    try {
        const { rows } = await db.query(queryText);
        return rows;
    } catch (error) {
        console.error('Error fetching categories from DB:', error);
        throw error;
    }
}

export default {
    getAllCategories
};