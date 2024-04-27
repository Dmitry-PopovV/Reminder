describe('template spec', () => {
    it('passes', () => {
        cy.visit('/');
        cy.get("[role=gridcell]").first().click();
        cy.contains("New event").click();

        cy.get("[value=\"New event\"]").clear().type("test_event");
        cy.contains("Save").click();

        cy.get("[class=\"fc-event-title fc-sticky\"]").contains("test_event");

        cy.contains("Delete").click();

        cy.get("[class=\"fc-event-title fc-sticky\"]").contains("test_event").should("not.exist");
    })
})
