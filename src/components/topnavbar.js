import React from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import '../App.css';
// import { variables } from '../variables';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from "react"; 
import { notificationMarkAllRead, setNotificationAsRead } from "./globalFunctions";

function TopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  // const { FirstName, LastName } = location.state || {};
  // Retrieve user's name from session storage
  const data = location.state;

  // Retrieve user's first name and last name from sessionStorage
  const firstName = sessionStorage.getItem('firstName');
  const lastName = sessionStorage.getItem('lastName');
  const profilePhoto = sessionStorage.getItem('profilePhoto');
  const defaultPhoto = "/img/user.png";

  // Retrieve user's role from sessionStorage
  const userRole = sessionStorage.getItem('role');
  
  const EmpId = sessionStorage.getItem("employeeId")

  const [hasNotification, setHasNotification] = useState(true);
  const [notification, setNotification] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
 

  const handleLogout = () => {
    // Clear sessionStorage on logout
    sessionStorage.removeItem('firstName');
    sessionStorage.removeItem('lastName');
    localStorage.removeItem('user');
    navigate('../');
  }; 

  // Function to format text into sentence case
  const toSentenceCase = (text) => {
    if (!text) return ''; // Handle null or undefined input
    return text
      .toLowerCase() // Convert the text to lowercase first
      .split(' ') // Split the text into an array of words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back together
  };
  
  useEffect(() => {  
    getNotifications()     
  }, []);

  const getNotifications = async () => {
    

    const formData = new FormData(); 
    formData.append('EmpId', EmpId); 
    
    try {
      const uploadResponse = await fetch('http://localhost:5000/getnotification', {
        method: 'POST',
        body: formData
      }) 
  
      if (!uploadResponse.ok) {
        console.error('Failed:', uploadResponse.statusText);
        return;
      } 

      try {
        const data = await uploadResponse.json();   
        if(data.result != 0){  
          if(data.result.some(notification => notification.IsSeen === false)){
            setHasNotification(true)
          } else {
            setHasNotification(false)
          }
          setNotification(data.result)
        }else{
          setHasNotification(false)
        }
        // setTotalPages(Math.ceil(data.result.count / pageSize))  
      } catch (error) {
          console.error('Error parsing JSON response:', error);
      }
 
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const clickNotification = async (notification) => {  
    setNotificationAsRead(notification.NotificationID)
    getNotifications()  
  
    const formData = new FormData(); 
    formData.append('SubmissionID', notification.SubmissionID); 
    
    try {
      const uploadResponse = await fetch('http://localhost:5000/getsubmissionfornotification', {
        method: 'POST',
        body: formData
      }) 
  
      if (!uploadResponse.ok) {
        console.error('Failed:', uploadResponse.statusText);
        return;
      } 

      try {
        const submission = await uploadResponse.json();   
        const data = submission.result.submissions[0] 
        navigate('/submissionview', {state: { data }});
      } catch (error) {
          console.error('Error parsing JSON response:', error);
      }
 
    } catch (error) {
      console.error('Error:', error);
    }
  };

  


  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      {/* Sidebar Toggle (Topbar) */}
      <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
        <i className="fa fa-bars"></i>
      </button>

      {/* Topbar Navbar */}
      <ul className="navbar-nav ml-auto">
        {/* Nav Item - Search Dropdown (Visible Only XS) */}
        <li className="nav-item dropdown no-arrow d-sm-none">
          <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i className="fas fa-search fa-fw"></i>
          </a>
        </li>

        
        <li className="nav-item dropdown no-arrow notification-drowpdown">
          <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="mr-2 d-none d-lg-inline text-gray-600 small"></span>
            <FontAwesomeIcon icon={faBell} className="notification-bell" /> 
            {hasNotification && <div className="notification-dot"></div>}          
          </a> 

          <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in notification-dropdown p-2" aria-labelledby="userDropdown">
            <div className="d-flex justify-content-between notification">
              <a className="" href="/viewnotifications"> 
                View All
              </a> 
              <a className="mb-1" onClick={()=>{notificationMarkAllRead(EmpId);getNotifications()}}> 
                Mark all as read
              </a>
            </div>
            

            {notification.length === 0 ? (
              <div className="d-flex justify-content-center p-1">
                <label className="m-auto text-center">You have no notifications yet!</label>
              </div>
            ) : (
              notification.map((notification, index) => (
                <a className={`dropdown-item ${notification.IsSeen ? 'notification-seen' : 'notification'}`} key={index}  
                onClick={()=>clickNotification(notification)}>
                  <div className="notification-card">
                    <div className="notification-title d-flex justify-content-between">
                      <div className="notification-title-div d-flex">
                        {!notification.IsSeen && <i className="fas fa-exclamation fa-sm fa-fw mr-2 mt-1 text-blue"></i>}
                        <label className="notification-title truncate-text">{notification.Title}</label>
                      </div>
                      <label className="notification-title">{notification.FormattedDateTime}</label>
                    </div>
                    <label className="truncate-text">{notification.Message}</label>
                  </div>
                </a>
              ))
            )}
          </div>
        </li>

        <div className="topbar-divider d-none d-sm-block"></div>

        {/* Nav Item - User Information */}
        <li className="nav-item dropdown no-arrow">
          <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="mr-2 d-none d-lg-inline text-gray-600 small">{toSentenceCase(firstName)} {toSentenceCase(lastName)}</span>
            {/* <img className="img-profile rounded-circle" src="img/undraw_profile.svg" alt="User Profile" /> */}
            <img className="img-profile rounded-circle" src={profilePhoto || defaultPhoto} alt="User Profile" />
          </a>
          {/* Dropdown - User Information */}
          <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
            {userRole === 'HRAdmin' && (
              <Link className="dropdown-item" to={{ pathname: "/profile"}} state={data}>
                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                <span>Profile</span>
              </Link>
            )}
             {/* <a className="dropdown-item" href="#">
              <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
              Settings
            </a>*/}
            {/* <a className="dropdown-item" href="#">
              <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400" to={{ pathname: "/employee"}} state={data}></i>
              Profile
            </a>  */}
            {userRole === 'Employee' && (
            <Link className="dropdown-item" to={{ pathname: "/employee"}} state={data}>
                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                <span>Profile</span>
              </Link>)}
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" data-toggle="modal" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
              Logout
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default TopNavbar;