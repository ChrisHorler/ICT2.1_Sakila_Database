const router = require('express').Router();

const stories = [
    {
        id: 'US-1',
        title: 'List & Search actors with Pagination',
        as: 'Admin',
        iWant: 'to search actors by name and paginate results',
        soThat: 'I can quickly find the right person',
        acceptance: [
            'GET /actors shows a table of actors sorted by last name, then first name.',
            'Search via query param q filters on first_name OR last_name (LIKE %q%).',
            'Pagination via page (>=1), page size = 20; invalid page clamps to 1.',
            'Empty results render a friendly “no results” state (no crash).'
        ]
    },
    {
        id: 'US-2',
        title: 'Create a new actor',
        as: 'Admin',
        iWant: 'to add a new actor',
        soThat: 'the catalogue stays up to date',
        acceptance: [
            'GET /actors shows a table of actors sorted by last name, then first name.',
            'Search via query param q filters on first_name OR last_name (LIKE %q%).',
            'Pagination via page (>=1), page size = 20; invalid page clamps to 1.',
            'Empty results render a friendly “no results” state (no crash).'
        ]
    },
    {
        id: 'US-3',
        title: 'View actor details',
        as: 'Admin',
        iWant: "to see an actor's details",
        soThat: 'I can inspect and verify records',
        acceptance: [
            'GET /actors/:id shows id, first_name, last_name, last_update.',
            '404 page if the id does not exist.',
            'Shows how many films reference this actor (film_actor count).'
        ]
    },
    {
        id: 'US-4',
        title: 'Edit an actor',
        as: 'Admin',
        iWant: 'to update names',
        soThat: 'data remains correct',
        acceptance: [
            'GET /actors/:id/edit pre-fills the form.',
            'POST /actors/:id/update validates input; on error, re-render with messages.',
            'On success, updates first_name/last_name, last_update=NOW(), then redirects to /actors/:id.'
        ]
    },
    {
        id: 'US-5',
        title: 'Delete an actor (with safeguards)',
        as: 'Admin',
        iWant: 'to remove actors that are no longer needed',
        soThat: 'the catalogue stays up to date',
        acceptance: [
            'POST /actors/:id/delete attempts to delete.',
            'If the actor is referenced in film_actor (FK constraint), show a friendly error and do not delete.',
            'On success, redirect to /actors list.'
        ]
    }
];

const nonFunctionals = [
    'SSR templates with EJS (no SPA) — RV-02',
    'Stack: JavaScript + MariaDB/MySQL — RV-01',
    'Bootstrap for layout/styling — RV-03',
    'Open source components where possible — RV-04',
    'Layered architecture (routes/controllers → services → repositories) — NF-01',
    'DRY (no duplicated SQL/logic) — NF-02',
    'Callbacks only (no async/await/Promises) — RV-06'
]

const implementationMap = [
    { method: 'GET',  path: '/',                     relatesTo: 'Milestone A (DB proof)' },
    { method: 'GET',  path: '/actors',               relatesTo: 'US-1' },
    { method: 'GET',  path: '/actors/new',           relatesTo: 'US-2' },
    { method: 'POST', path: '/actors',               relatesTo: 'US-2' },
    { method: 'GET',  path: '/actors/:id',           relatesTo: 'US-3' },
    { method: 'GET',  path: '/actors/:id/edit',      relatesTo: 'US-4' },
    { method: 'POST', path: '/actors/:id/update',    relatesTo: 'US-4' },
    { method: 'POST', path: '/actors/:id/delete',    relatesTo: 'US-5' }
];

router.get('/', (req,res) => {
    res.render('about', {
        title: 'About / User Stories',
        viewpoint: 'Admin',
        stories,
        nonFunctionals,
        implementationMap
    });
});

module.exports = router;