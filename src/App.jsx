import React, { useState, useEffect } from 'react';
import PrivateLayout from 'layouts/PrivateLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from 'context/userContext';
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Index from 'pages/Index';
import IndexUsuarios from 'pages/usuarios';
import EditarUsuario from 'pages/usuarios/editar';
import AuthLayout from 'layouts/AuthLayout';
import Register from 'pages/auth/register';
import Login from 'pages/auth/login';
import { AuthContext } from 'context/authContext';
import IndexProyectos from 'pages/proyectos/index';
import jwt_decode from 'jwt-decode';
import NuevoProyecto from 'pages/proyectos/NuevoProyecto';
import IndexInscripciones from 'pages/inscripciones';
import IndexAvance from 'pages/avances';
import Profile from 'pages/profile';
import 'styles/globals.css';
import 'styles/tabla.css';

const httpLink = createHttpLink({
  uri: 'https://proyectos-backend.herokuapp.com/graphql',
  // uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = JSON.parse(localStorage.getItem('token'));
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

function App() {
  const [userData, setUserData] = useState({});
  const [authToken, setAuthToken] = useState('');

  const setToken = (token) => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem('token', JSON.stringify(token));
    } else {
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    if (authToken) {
      const decoded = jwt_decode(authToken);
      setUserData({
        _id: decoded._id,
        nombre: decoded.nombre,
        apellido: decoded.apellido,
        identificacion: decoded.identificacion,
        correo: decoded.correo,
        rol: decoded.rol,
        foto: decoded.foto,
      });
    }
  }, [authToken]);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ authToken, setAuthToken, setToken }}>
        <UserContext.Provider value={{ userData, setUserData }}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<PrivateLayout />}>
                <Route path='' element={<Index />} />
                <Route path='/usuarios' element={<IndexUsuarios />} />
                <Route
                  path='/usuarios/editar/:_id'
                  element={<EditarUsuario />}
                />
                <Route path='proyectos' element={<IndexProyectos />} />
                <Route path='/proyectos/nuevo' element={<NuevoProyecto />} />
                <Route path='/inscripciones' element={<IndexInscripciones />} />
                <Route path='/avances/:projectid' element={<IndexAvance />} />
                <Route path='/perfil' element={<Profile />} />
              </Route>
              <Route path='/auth' element={<AuthLayout />}>
                <Route path='register' element={<Register />} />
                <Route path='login' element={<Login />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

export default App;
