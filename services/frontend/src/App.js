import Amplify, {} from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import ListForm from './components/ListForm';
import React from 'react';
import '@aws-amplify/ui-react/styles.css';


Amplify.configure({
  Auth: {
      region: 'us-west-2',
      userPoolId: 'us-west-2_DRtcga3yY',
      userPoolWebClientId: '3misof2lheqo0j9hi1rd88deqa',
  },
  API: {
    endpoints: [
        {
            name: "UpvoteApi",
            endpoint: "https://5dnw5vstde.execute-api.us-west-2.amazonaws.com/dev/v1"
        }
    ]
  }
});

const App = () => (
    <Authenticator>
    {({ signOut, user }) => (
      <main>
        <h1>Hello {user.username}</h1>
        <button onClick={signOut}>Sign out</button>
        <ListForm />
      </main>
    )}
  </Authenticator>
);

export default App;
