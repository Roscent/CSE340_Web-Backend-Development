// Import any needed model functions
import { getAllProjects } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectById(projectId);
    const categories = await getCategoriesByProjectId(projectId);
    const title = project ? project.title : 'Project Details';

    if (!project) {
        const err = new Error('Project not found');
        err.status = 404;
        throw err;
    }

    res.render('project', { title, project, categories });
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };