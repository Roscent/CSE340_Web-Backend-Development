import db from './db.js'

/* *****************************
 * Get all service projects
 * *************************** */
async function getAllProjects() {
    try {
        const sql = "SELECT * FROM public.projects ORDER BY project_name ASC";
        const data = await db.query(sql);
        return data.rows;
    } catch (error) {
        console.error("getAllProjects error: " + error);
        return []; // Return an empty array if the query fails to prevent crashing
    }
}

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
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
            title,
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

export { getAllProjects, getProjectsByOrganizationId, getProjectById };