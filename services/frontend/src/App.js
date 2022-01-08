import Amplify, {} from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import ListForm from './components/ListForm';
import React from 'react';
import '@aws-amplify/ui-react/styles.css';


Amplify.configure({
  Auth: {
      region: 'us-west-2',
      userPoolId: 'us-west-2_7TemzS357',
      userPoolWebClientId: '2hsnnfe28i2n864lo87l7i38iv',
  },
  API: {
    endpoints: [
        {
            name: "UpvoteApi",
            endpoint: "https://dhh2i3bir5.execute-api.us-west-2.amazonaws.com/dev"
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
