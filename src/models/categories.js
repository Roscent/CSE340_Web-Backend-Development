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

/**
 * Retrieves a single category by its ID
 */
async function getCategoryById(categoryId) {
    const queryText = 'SELECT category_id, name FROM category WHERE category_id = $1;';
    try {
        const { rows } = await db.query(queryText, [categoryId]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error fetching category by ID from DB:', error);
        throw error;
    }
}

/**
 * Retrieves all categories for a given service project
 */
async function getCategoriesByProjectId(projectId) {
    const queryText = `
        SELECT c.category_id, c.name 
        FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name ASC;
    `;
    try {
        const { rows } = await db.query(queryText, [projectId]);
        return rows;
    } catch (error) {
        console.error('Error fetching categories by project ID from DB:', error);
        throw error;
    }
}

/**
 * Retrieves all service projects for a given category
 */
async function getProjectsByCategoryId(categoryId) {
    const queryText = `
        SELECT p.project_id, p.title, p.description, p.location, p.date
        FROM project p
        JOIN project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.title ASC;
    `;
    try {
        const { rows } = await db.query(queryText, [categoryId]);
        return rows;
    } catch (error) {
        console.error('Error fetching projects by category ID from DB:', error);
        throw error;
    }
}

export { getAllCategories, getCategoryById, getCategoriesByProjectId, getProjectsByCategoryId };