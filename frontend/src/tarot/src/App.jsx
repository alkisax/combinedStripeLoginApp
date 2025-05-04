import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Deck1 from './pages/Deck1';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/deck1",
    element: <Deck1 />,
  }
]);

const App = () => {
  return (
      <RouterProvider router={router} />
  );
}
export default App;