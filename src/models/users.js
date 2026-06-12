import db from './db.js';
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const queryParams = [email];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    // 1. Use findUserByEmail to get the user
    const user = await findUserByEmail(email);
    
    // 2. If no user is found, return null
    if (!user) {
        return null;
    }

    // 3. Use verifyPassword to check if the password is correct
    const isPasswordValid = await verifyPassword(password, user.password_hash);

    // 4. If the password is correct, remove password_hash and return the user object. If not, return null.
    if (isPasswordValid) {
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    return null;
};

/**
 * Retrieves all registered users with their roles
 */
const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.user_id ASC;
    `;
    
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
};


export { createUser, authenticateUser, getAllUsers };