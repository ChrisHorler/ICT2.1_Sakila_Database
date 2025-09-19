describe("Films list & detail", () => {
    it("films page renders search + category filter", () => {
        cy.visit("/films");
        cy.get('form[action^="/films"]').should("exist");
        cy.get('input[name="q"]').should("exist");
        cy.get('select[name="category_id"]').should("exist");
    });

    it("navigates to a film detail from the list", () => {
        cy.visit("/films");
        cy.get('a[href^="/films/"]').first().click({ force: true });
        cy.url().should("match", /\/films\/\d+$/);
        cy.get("h1,h2,h3").should("exist");
    });
});

describe("Actors list & detail", () => {
    it("actors table exists and has rows", () => {
        cy.visit("/actors");
        cy.get("table").should("exist");
        cy.get("table tbody tr").its("length").should("be.gte", 1);
    });

    it("navigates to an actor detail from the list", () => {
        cy.visit("/actors");
        cy.get('a[href^="/actors/"]').first().click({ force: true });
        cy.url().should("match", /\/actors\/\d+$/);
        cy.get("h1,h2,h3").should("exist");
    });
});
