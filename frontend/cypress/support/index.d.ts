declare namespace Cypress {
    interface Chainable<Subject = any> {
        login(): Chainable<any>;
        getByTestId(id: string): Chainable<any>;
    }
}