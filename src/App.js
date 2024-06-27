import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import LoginPage from './components/login';
import Register from './components/register';
import Dashboard from './components/dashboard';
import NewHireUpload from './components/newHireUpload';
import Reports from './components/reports';
import Footer from './components/footer';
import UpdateEmployeeInfo from './components/update';  
import Profile from './components/profile';
import Employee from './components/employee';
import EmployeeProfile from './components/employeeProfile';
import ChangePassword from './components/changePassword';
import ForgotPasswordPage from './components/forgotpassword';

import SSSLoan from './components/loans/sssLoan';
import PagIbigLandbankCard from './components/loans/pagIbigLandbankCard';
import PagIbigVirtualAccount from './components/loans/pagIbigVirtualAccount';
import MaternityNotification from './components/loans/MaternityNotification';
import MaternityBenefit from './components/loans/MaternityBenefit';
import SSSRequest from './components/request/SSSrequest';
import PAGIBIGrequest from './components/request/PAG-IBIGrequest';
import PHILHEALTHrequest from './components/request/PHILHEALTHrequest';

import Submissions from './components/submission/submission';
import SubmissionView from './components/submission/submissionView';

import HRIAssist from './components/hriassist/hrIAssist';
import RequestView from './components/hriassist/requestView';
import ViewNotifications from './components/notification/viewNotifications';
 
import SicknessNotification from './components/sickness/SicknessNotification';
import SicknessApproval from './components/sickness/SicknessApproval';

import UpdateEmployee from './components/hriassist/UpdateEmployee';
import OtherRequest from './components/hriassist/OtherRequest';



import Test from './components/test';


function App() {
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/newHireUpload" element={<NewHireUpload />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update" element={<UpdateEmployeeInfo />} />
          <Route path="/update/:employeeId" element={<UpdateEmployeeInfo />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/employeeProfile" element={<EmployeeProfile />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage/>}></Route>

          {/* Submission Pages */}
          <Route path="/submissions" element={<Submissions />} />
            <Route path="/submissionview" element={<SubmissionView/>} />

          {/* iAssist Pages */} 
            <Route path="/sssloan" element={<SSSLoan />} />
            <Route path="/landbankcard" element={<PagIbigLandbankCard />} />
            <Route path="/virtualaccount" element={<PagIbigVirtualAccount />} />
            <Route path="/notification" element={<MaternityNotification />} />
            <Route path="/benefit" element={<MaternityBenefit />} />

            <Route path="/SSSrequest" element={<SSSRequest />} />
            <Route path="/PIrequest" element={<PAGIBIGrequest />} />
            <Route path="/PHILHEALTHrequest" element={<PHILHEALTHrequest />} />

            <Route path="/SicknessNotification" element={<SicknessNotification />} /> 
            <Route path="/SicknessApproval" element={<SicknessApproval />} /> 
            <Route path="/UpdateEmployee" element={<UpdateEmployee />} />
            <Route path="/OtherRequest" element={<OtherRequest />} />

          {/* HR iAssist Pages */}
          <Route path="/hriassist" element={<HRIAssist />} />
            <Route path="/request" element={<RequestView />} />
   
          {/* All */}
          <Route path="/viewnotifications" element={<ViewNotifications />} />

            <Route path="/test" element={<Test/>} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;