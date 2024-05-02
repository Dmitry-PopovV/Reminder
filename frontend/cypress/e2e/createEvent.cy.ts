describe('create event', () => {
    before(() => {
        cy.login();
    })

    it('checks event\'s creation and deletion', () => {
        cy.visit('/');
        cy.get("[role=gridcell]").first().click();
        cy.getByTestId("newEventButton").click();

        cy.getByTestId("titleInput").clear().type("test_event");
        cy.getByTestId("saveButton").click();

        cy.get("[class=\"fc-event-title fc-sticky\"]").contains("test_event");

        cy.getByTestId("deleteButton").click();

        cy.contains("test_event").should("not.exist");
    })
})
