import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../navbar';
import TopNavbar from '../topnavbar';
import Footer from '../footer';
import '../../App.css'; 
import { useNavigate } from 'react-router-dom';
 
import { notificationMarkAllRead, setNotificationAsRead } from "../globalFunctions";


 function ViewNotifications() { 

    const location = useLocation();
    const navigate = useNavigate();
 
    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);  
    
 

    const [hasNotification, setHasNotification] = useState(true);
    const [notification, setNotification] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(10);
   
     
  
    useEffect(() => { 
      getNotifications(currentPage, pageSize)    
    }, [currentPage, pageSize]); 

    
  const getNotifications = async (pageNumber, pageSize) => {
    
    const EmpId = sessionStorage.getItem("employeeId")  
    

    const formData = new FormData(); 
    formData.append('EmpId', EmpId); 
    formData.append('pageNumber', pageNumber); 
    formData.append('pageSize', pageSize); 
     
    try {
      const uploadResponse = await fetch('http://localhost:5000/getnotificationsforviewall', {
        method: 'POST',
        body: formData
      }) 
  
      if (!uploadResponse.ok) {
        console.error('Failed:', uploadResponse.statusText);
        return;
      } 

      try {
        const data = await uploadResponse.json();
        setNotification(data.result.notification) 
        setTotalPages(Math.ceil(data.result.count / pageSize))    
      } catch (error) {
          console.error('Error parsing JSON response:', error);
      }
 
    } catch (error) {
      console.error('Error:', error);
    }
  };
    
  const clickNotification = async (notification) => {  
    setNotificationAsRead(notification.NotificationID) 
    
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
        navigate('/request', {state: { data }});
      } catch (error) {
          console.error('Error parsing JSON response:', error);
      }
 
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const Pagination = ({ currentPage }) => { 
  
    const handleNextClick = () => {
      setCurrentPage(currentPage + 1);
    };
  
    const handlePreviousClick = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };
  
    return (
      <div className='pagination-btn'>
        <button onClick={handlePreviousClick} disabled={currentPage === 1} >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextClick} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    );
  };
  
    return (
      <div id="wrapper">
          <Navbar />
          <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <TopNavbar />
          <div className="container-fluid">
                  <div className="container-fluid">
                    <div className="row justify-content-center">
                      <h4 className="m-0 font-weight-bold text-primary header-name">Notification</h4>
                    </div>
                  </div>
          <div className="row justify-content-center">
            <div className="col-xl-12 col-xl-9">
              <br/> 
                <div className='pagination'>
                  <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    // totalCount={submissions.length} // You may need to fetch the total count from the backend
                    onPageChange={handlePageChange}
                  />
                </div>
              <br/> 
                {/* page content begin here */}  
                {notification && notification.map((notification, index) =>
                  <div className="container-fluid">
                      <div className="row justify-content-center">
                          <div className="col-xl-8 col-lg-7">  
                              <div className={`card shadow mb-2 ${notification.IsSeen && 'notificationView-card-seen'} notificationView-card`} onClick={() => clickNotification(notification)}>
                                  {/* Card Header - New Hire Upload */}
                                  <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 className="m-0 font-weight-bold text-primary">{notification.Title}</h6> 
                                    <h6 className="m-0 font-weight-bold">{notification.FormattedDateTime}</h6> 
                                  </div>
                                  {/* Card Body - New Hire Options */}
                                  <div className="">
                                      <div className="tab-content">
                                          <div className="card-body">
                                              <div className="d-flex justify-content-between align-items-center">
                                                <label>{notification.Message}</label>  
                                              </div> 
                                          </div>
                                      </div>
                                  </div>
                              </div> 
                          </div>
                      </div>
                  </div>
                )} 
                {/* Page content ends here */} 
                <div className='pagination'>
                  <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    // totalCount={submissions.length} // You may need to fetch the total count from the backend
                    onPageChange={handlePageChange}
                  />
                </div>
                 
              </div>
 
              </div>   
              </div>
              </div>
              <Footer />
          </div>
      </div>
  );
}

export default ViewNotifications;

