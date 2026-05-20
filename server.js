import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Define the the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
  * Configure Express middleware
  */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Routes
 */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
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

    // 2. Pass BOTH the title and the organizations array to the view
    res.render('organizations', { 
        title, 
        organizations 
    });
});

app.get('/projects', async (req, res) => {
    const title = 'Service Projects';
    res.render('projects', { title });
});

app.get('/categories', async (req, res) => {
    const title = 'Project category page';
    res.render('categories', { title });
});

app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode`);
    console.log(`Server listening on http://localhost:${PORT}`);
});