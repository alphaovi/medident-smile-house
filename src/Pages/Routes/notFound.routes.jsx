import NotFound from "../SharedPages/ErrorPage/NotFound";


const notFoundRoutes = [
    {
    path: "*",
    element: <NotFound></NotFound>,
  },
];


export default notFoundRoutes;