import Amplify, {} from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Grid from '@mui/material/Grid';

import AppBarMenu from "./components/AppBarMenu";
import AppRoutes from "./components/AppRoutes"

Amplify.configure({
  Auth: {
      region: 'us-west-2',
      userPoolId: 'us-west-2_snpPzGNT1',
      userPoolWebClientId: '194bg73sh47pko7smnthjvr4gb',
  },
  API: {
    endpoints: [
        {
            name: "UpvoteApi",
            endpoint: "https://dnn2pakiuj.execute-api.us-west-2.amazonaws.com/dev/v1"
        }
    ]
  }
});

const App = () => (
    <Authenticator>
    {({ signOut, user }) => (
      <BrowserRouter>
        <main>
          <div className="App">
            <AppBarMenu/>
            <h1>Hello {user.username}</h1>
            <button onClick={signOut}>Sign out</button>
            <Grid
              container
              spacing={3}
              direction="column"
              alignItems="center"
            >
              <Grid item xs={10}>
              <Routes>
              {AppRoutes.map((prop, key) => (
                <Route key={key} path={prop.path} element={<prop.component />} />
              ))}
              </Routes>
              </Grid>
            </Grid>
          </div>
        </main>
      </BrowserRouter>
    )}
  </Authenticator>
);

export default App;
