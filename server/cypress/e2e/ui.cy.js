describe("UI smoke", () => {
    it("Home renders navbar", () => {
        cy.visit("/");
        cy.get(".navbar").should("exist");
    });

    it("Films page shows a filter form and some film content", () => {
        cy.visit("/films");

        cy.get('form[action^="/films"]').should("exist");

        cy.get("body").then(($b) => {
            if ($b.find(".catalog-list").length) {
                cy.get(".catalog-list").should("exist");
            } else {
                cy.get('a[href^="/films/"]').its("length").should("be.gte", 1);
            }
        });
    });

    it("Actors page renders a table", () => {
        cy.visit("/actors");
        cy.get("table").should("exist");
    });
});
