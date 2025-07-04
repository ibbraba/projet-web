import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from './pages/index';
import LoginPage from './pages/Connexion/LoginPage';
import SignupPage from './pages/inscription/SignupPage';
import Profile from './pages/Profile/Profile';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, ServerError, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/chat" element={<Index />} />
          <Route path="/editprofile" element={<Profile />} />
          <Route path="/chat/:id" element={<Index />} />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
