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
        SELECT p.project_id, p.name AS title, p.description, p.location, p.date
        FROM project p
        JOIN project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.name ASC;
    `;
    try {
        const { rows } = await db.query(queryText, [categoryId]);
        return rows;
    } catch (error) {
        console.error('Error fetching projects by category ID from DB:', error);
        throw error;
    }
}

/**
 * Assigns a single category to a project
 * @param {number} categoryId - The category ID to assign
 * @param {number} projectId - The project ID to assign the category to
 */
const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;

    await db.query(query, [categoryId, projectId]);
}

/**
 * Updates all category assignments for a project
 * @param {number} projectId - The project ID to update categories for
 * @param {number[]} categoryIds - Array of category IDs to assign to the project
 */
const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

/**
 * Creates a new category in the database
 * @param {string} name - The category name
 * @returns {Promise<number>} - The ID of the newly created category
 */
async function createCategory(name) {
    const queryText = `
        INSERT INTO category (name)
        VALUES ($1)
        RETURNING category_id;
    `;
    try {
        const { rows } = await db.query(queryText, [name.trim()]);
        return rows[0].category_id;
    } catch (error) {
        console.error('Error creating category in DB:', error);
        if (error.code === '23505') { // Unique violation
            throw new Error('A category with this name already exists');
        }
        throw error;
    }
}

/**
 * Updates an existing category in the database
 * @param {number} categoryId - The ID of the category to update
 * @param {string} name - The new category name
 * @returns {Promise<void>}
 */
async function updateCategory(categoryId, name) {
    const queryText = `
        UPDATE category 
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;
    try {
        const { rows } = await db.query(queryText, [name.trim(), categoryId]);
        if (rows.length === 0) {
            throw new Error('Category not found');
        }
    } catch (error) {
        console.error('Error updating category in DB:', error);
        if (error.code === '23505') { // Unique violation
            throw new Error('A category with this name already exists');
        }
        throw error;
    }
}

/**
 * Checks if a category name already exists (excluding a specific category ID for edit)
 * @param {string} name - The category name to check
 * @param {number} excludeId - Optional category ID to exclude from check
 * @returns {Promise<boolean>}
 */
async function isCategoryNameUnique(name, excludeId = null) {
    let queryText = 'SELECT category_id FROM category WHERE name = $1';
    const params = [name.trim()];
    
    if (excludeId) {
        queryText += ' AND category_id != $2';
        params.push(excludeId);
    }
    
    try {
        const { rows } = await db.query(queryText, params);
        return rows.length === 0;
    } catch (error) {
        console.error('Error checking category name uniqueness:', error);
        throw error;
    }
}


export { getAllCategories, getCategoryById, getCategoriesByProjectId, getProjectsByCategoryId, updateCategoryAssignments, createCategory, updateCategory, isCategoryNameUnique };