import { body, validationResult } from 'express-validator';
import { getAllCategories, getCategoryById, getProjectsByCategoryId, getCategoriesByProjectId, updateCategoryAssignments, createCategory, updateCategory, isCategoryNameUnique } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    
    if (!category) {
        const err = new Error('Category not found');
        err.status = 404;
        throw err;
    }
    
    const projects = await getProjectsByCategoryId(categoryId);
    const title = `${category.name} Projects`;

    res.render('category', { title, category, projects });
};

const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        const projectDetails = await getProjectDetails(projectId);
        
        if (!projectDetails) {
            const err = new Error('Project not found');
            err.status = 404;
            return next(err);
        }
        
        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);

        const title = 'Assign Categories to Project';

        res.render('assign-categories', { 
            title, 
            projectId, 
            projectDetails, 
            categories, 
            assignedCategories 
        });
    } catch (error) {
        next(error);
    }
};

const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        let selectedCategoryIds = req.body.categoryIds || [];
        
        const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
        
        const numericCategoryIds = categoryIdsArray.map(id => parseInt(id, 10));
        
        await updateCategoryAssignments(projectId, numericCategoryIds);
        
        req.flash('success', 'Categories updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error processing category assignments:', error);
        req.flash('error', 'There was a problem updating the categories. Please try again.');
        res.redirect(`/project/${req.params.projectId}`);
    }
};

/**
 * Server-side validation rules for category operations
 */
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
        .custom(async (value, { req }) => {
            const categoryId = req.params.id;
            const isUnique = await isCategoryNameUnique(value, categoryId);
            if (!isUnique) {
                throw new Error('A category with this name already exists');
            }
            return true;
        })
];

/**
 * Display the new category form
 */
const showNewCategoryForm = async (req, res) => {
    const title = 'Add New Category';
    res.render('new-category', { title });
};

/**
 * Process the new category form submission
 */
const processNewCategoryForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-category');
    }

    const { name } = req.body;

    try {
        const categoryId = await createCategory(name);
        req.flash('success', 'Category created successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error processing new category form:', error);
        req.flash('error', error.message || 'There was a problem creating the category. Please try again.');
        res.redirect('/new-category');
    }
};

/**
 * Display the edit category form
 */
const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }

        const title = 'Edit Category';
        res.render('edit-category', { title, category });
    } catch (error) {
        next(error);
    }
};

/**
 * Process the edit category form submission
 */
const processEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        
        const results = validationResult(req);
        if (!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });
            return res.redirect(`/edit-category/${categoryId}`);
        }

        const { name } = req.body;
        await updateCategory(categoryId, name);
        
        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error updating category:', error);
        req.flash('error', error.message || 'There was a problem updating the category. Please try again.');
        res.redirect(`/edit-category/${req.params.id}`);
    }
};

export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm, categoryValidation };
