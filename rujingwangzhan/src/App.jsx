import { RouterProvider } from 'react-router-dom';
import router from './router/router';
import HeaderHome from './components/header';
import FooterHome from './components/footer';
function App() {


  return (
    <div>
      <HeaderHome />
      <RouterProvider router={router}></RouterProvider>
      <FooterHome />
    </div>


  );
}

export default App
