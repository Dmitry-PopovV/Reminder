import Landing from "../../src/components/Landing/Landing";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from "react-redux";
import { store } from '../../src/store';

describe('Landing', () => {
    it('checks image loading', () => {
        cy.mount(
            <Provider store={store}>
                <GoogleOAuthProvider clientId="1014605016286-6ch6iebr5l3eten2brtv7qr7c76s16jp.apps.googleusercontent.com">
                    <Landing />
                </GoogleOAuthProvider>
            </Provider>
        );
        cy.get('img').should((el) => {
            expect(el[0].naturalWidth).to.be.greaterThan(0);
        });
    });
})
