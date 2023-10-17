import routerPaths from "./routerPaths";
import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from "react-redux"
import { store } from './store';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId="1014605016286-6ch6iebr5l3eten2brtv7qr7c76s16jp.apps.googleusercontent.com">
        <RouterProvider router={routerPaths} />
      </GoogleOAuthProvider>
    </Provider>
  )
}

export default App;
