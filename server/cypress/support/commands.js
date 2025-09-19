// Robust UI login stored in a Cypress session.
// Works reliably with express-session cookies/redirects.
Cypress.Commands.add("loginAsAdmin", () => {
    const user = Cypress.env("ADMIN_USER");
    const pass = Cypress.env("ADMIN_PASS");

    cy.session(["admin-ui", user], () => {
        cy.clearCookies();
        cy.visit("/auth/login?next=%2F");

        cy.get('input[name="username"]').should("be.visible").clear().type(user);
        cy.get('input[name="password"]').clear().type(pass, { log: false });
        cy.get("form").submit();

        // Land anywhere but the login page and ensure the cookie exists
        cy.url().should("not.include", "/auth/login");
        cy.getCookie("connect.sid").should("exist");
    }, { cacheAcrossSpecs: true });
});
