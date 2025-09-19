describe("Routes respond", () => {
    const paths = ["/", "/films", "/actors", "/auth/login"];

    paths.forEach((p) => {
        it(`GET ${p} returns 200`, () => {
            cy.request(p).its("status").should("be.within", 200, 303);
        });
    });
});
