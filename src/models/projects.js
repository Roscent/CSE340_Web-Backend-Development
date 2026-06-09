import db from './db.js'

/* *****************************
 * Get all service projects
 * *************************** */
async function getAllProjects() {
    try {
        const sql = "SELECT project_id, organization_id, name AS title, description, location, date FROM project ORDER BY name ASC";
        const data = await db.query(sql);
        return data.rows;
    } catch (error) {
        console.error("getAllProjects error: " + error);
        return [];
    }
}

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          name AS title,
          description,
          location,
          date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);
      return result.rows;
};

const getProjectById = async (projectId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            name as title,
            description,
            location,
            date
        FROM project
        WHERE project_id = $1;
    `;
    
    const queryParams = [projectId];
    const result = await db.query(query, queryParams);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const createProject = async (name, description, location, date, organizationId) => {
    const query = `
      INSERT INTO project (name, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [name, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

const getUpcomingProjects = async (numberOfProjects) => {
    const query = `
        SELECT
            p.project_id,
            p.name AS title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;
    
    const result = await db.query(query, [numberOfProjects]);
    return result.rows;
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT
            p.project_id,
            p.name AS title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};


/**
 * Updates an existing project in the database
 * @param {number} projectId - The ID of the project to update
 * @param {string} name - Project title
 * @param {string} description - Project description
 * @param {string} location - Project location
 * @param {Date} date - Project date
 * @param {number} organizationId - Organization ID
 * @returns {Promise<void>}
 */
const updateProject = async (projectId, name, description, location, date, organizationId) => {
    const query = `
        UPDATE project 
        SET name = $1, 
            description = $2, 
            location = $3, 
            date = $4, 
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;
    const queryParams = [name, description, location, date, organizationId, projectId];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
        throw new Error('Failed to update project - project not found');
    }
};



export { getAllProjects, getProjectsByOrganizationId, getProjectById, createProject, getUpcomingProjects, getProjectDetails, updateProject };