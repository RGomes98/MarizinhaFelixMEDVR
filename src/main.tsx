import { createRouter, Navigate, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen.ts';

import ReactDOM from 'react-dom/client';
import React from 'react';

import '@/stylesheets/globals.scss';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => Navigate({ to: '/', replace: true }),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
