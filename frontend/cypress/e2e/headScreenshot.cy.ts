describe('head screenshot', () => {
    before(() => {
        cy.login();
    })

    it('makes screenshot', () => {
        cy.visit('/');
        cy.getByTestId("headMainContainer").screenshot();
    })
})
