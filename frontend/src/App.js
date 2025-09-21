import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import { UserProvider } from "./authentication/pages/UserContext"




import UserLayout from "./user-panel/common-components/Layout/Layout"
import AdminLayout from "./admin-panel/common-components/Layout/Layout"

import SignUp from './authentication/pages/SignUp';
import Login from './authentication/pages/Login';
import EmailConfirmation from './authentication/pages/EmailConfirmation';
import EmailConfirmed from './authentication/pages/EmailConfirmed';
import ForgotPassword from './authentication/pages/ForgotPassword';

import NewPassword from './authentication/pages/NewPassword';
import PasswordChanged from './authentication/pages/PasswordChanged';
import AuthenticationPrivacyPolicy from "./authentication/pages/PrivacyPolicy";
import LandingPrivacyPolicy from "./landing-page/privacy-policy/PrivacyPolicy";






function App() {




  return (


    <div className="App">

      <Router>
        <UserProvider>
          <Routes>

            <Route path="/*" element={<UserLayout />} />

            <Route exact path="/admin/*" element={<AdminLayout />} />




            <Route exact path="/admin-login/*" element={
              <>
                {localStorage.setItem("userRoleRequest", "admin")}
                <Navigate to="/login" />
              </>
            } />



            <Route path="login" element={<Login />} />
            <Route exact path="/login/*" element={
              <>
                {localStorage.setItem("userRoleRequest", "user")}
                <Navigate to="/login" />
              </>
            } />
            <Route path="sign-up" element={<SignUp />} />
            

          <Route path="/confirm-mail" element={<EmailConfirmation />} />
             <Route path="/mail-confirmed" element={<EmailConfirmed />} /> 
            <Route path="/forgot-password" element={<ForgotPassword />} /> 
            <Route path="/reset-password/*" element={<NewPassword />} />
            <Route path="/password-changed" element={<PasswordChanged />} />
            <Route path="/authentication-privacy-policy" element={<AuthenticationPrivacyPolicy/>} />


            <Route path="/landing-page-privacy-policy" element={<LandingPrivacyPolicy />} />

          </Routes>
        </UserProvider>
      </Router>


    </div>

  );
}

export default App;
