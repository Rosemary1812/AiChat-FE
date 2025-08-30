import { createBrowserRouter, createRoutesFromElements, Route,Outlet} from 'react-router-dom';

import App from '../App';
import LayoutWithSidebar from '../components/Layout/LayoutWithSidebar';
import PageTransition from '../components/PageTransition/PageTransition';
import {WithPermission} from '../components/WithPermission/WithPermission';

import Agents from '../pages/Agents';
import CreateAccount from '../pages/CreateAccount';
import Home from '../pages/Home';
import Login from '../pages/Login';
import {SharedChat} from '../pages/SharedChat';

const routeElements = createRoutesFromElements(
  <Route path="/" element={<App/>}>
    <Route
    element={
      <PageTransition>
        <Outlet/>
      </PageTransition>
    }>
      <Route path="/login" element={<Login/>}/>
      <Route path="/create-account" element={<CreateAccount/>}/>
      <Route path="/shared/:sharedId" element={<SharedChat/>}/>
    </Route>

    <Route
    element={
      <WithPermission>
        <LayoutWithSidebar/>
      </WithPermission>
    }>
      <Route path="/" element={<Home/>}/>
      <Route path="/conversation" element={<Home/>}/>
      <Route path="/conversation/:id" element={<Home/>}/>
      <Route path="/agents" element={<Agents/>}/>
    </Route>
  </Route>
)

const router = createBrowserRouter(routeElements)

export default router