import routerPaths from "./routerPaths";
import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <GoogleOAuthProvider clientId="1014605016286-6ch6iebr5l3eten2brtv7qr7c76s16jp.apps.googleusercontent.com">
      <RouterProvider router={routerPaths} />
    </GoogleOAuthProvider>
  )
}

export default App;
