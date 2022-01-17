import React from 'react';
import Home from './Home';
import Lists from './Lists'

const AppRoutes = [
    {
      path: '/',
      menuName: 'Home',
      component: Home
    },
    {
      path: '/lists',
      menuName: 'Lists',
      component: Lists
    }
  ];
  
  export default AppRoutes;