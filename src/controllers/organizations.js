import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

const showOrganizationsPage = async (req, res) => {
    const organization = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    const organizations = [
        {
            name: "BrightFuture Builders logo",
            logo_filename: "brightfuture-logo.png",
            contact_email: "info@brightfuture.org"
        },
        {
            name: "GreenHarvest Growers logo",
            logo_filename: "greenharvest-logo.png",
            contact_email: "contact@greenharvest.org"
        },
        {
            name: "UnityServe Volunteers logo",
            logo_filename: "unityserve-logo.png",
            contact_email: "hello@unityserve.org"
        }
    ];

    res.render('organizations', { 
        title, 
        organizations 
    });
};

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organizations', {title, organizationDetails, projects});
};

export { showOrganizationsPage, showOrganizationDetailsPage };
