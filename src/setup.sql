-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Project-Category Junction Table (Many-to-Many)
-- ========================================
-- First, create the project table if it doesn't exist
CREATE TABLE IF NOT EXISTS project (
    project_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    organization_id INTEGER REFERENCES organization(organization_id) ON DELETE SET NULL,
    start_date DATE,
    end_date DATE,
    location VARCHAR(255)
);

-- Junction table for many-to-many relationship between projects and categories
CREATE TABLE project_category (
    project_id INTEGER REFERENCES project(project_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- ========================================
-- Insert sample data: Categories (at least 3)
-- ========================================
INSERT INTO category (name) VALUES
('Environmental'),
('Education'),
('Health & Wellness'),
('Community Development');

-- ========================================
-- Insert sample data: Projects (if not already present)
-- ========================================
INSERT INTO project (name, description, organization_id, location) VALUES
('Community Garden Build', 'Building sustainable gardens in urban areas', 
    (SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 
    'Downtown District'),
('School Library Renovation', 'Renovating and stocking school libraries', 
    (SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 
    'Various Elementary Schools'),
('Senior Center Volunteer Day', 'Providing services and companionship to seniors', 
    (SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 
    'Sunset Senior Center');

-- ========================================
-- Associate each project with at least one category
-- ========================================
-- Community Garden Build -> Environmental and Community Development
INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p, category c
WHERE p.name = 'Community Garden Build' 
AND c.name IN ('Environmental', 'Community Development');

-- School Library Renovation -> Education and Community Development
INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p, category c
WHERE p.name = 'School Library Renovation' 
AND c.name IN ('Education', 'Community Development');

-- Senior Center Volunteer Day -> Community Development
INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p, category c
WHERE p.name = 'Senior Center Volunteer Day' 
AND c.name = 'Community Development';
