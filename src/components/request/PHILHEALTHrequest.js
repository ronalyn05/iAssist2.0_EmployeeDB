import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../navbar';
import TopNavbar from '../topnavbar';
import Footer from '../footer';
import '../../App.css';
import { sendEmail } from '../globalFunctions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SSSRequest() {

  const EmployeeId = sessionStorage.getItem("employeeId");

  const [selected, setSelected] = useState("0");
  const [selectedReason, setSelectedReason] = useState("0");
  const [reason, setReason] = useState("0");

  const [thisInfo, setThisInfo] = useState({
    EmailNotification: '',
    ProvidentApplicationForm: ''
  }); 
  // useEffect(() => {
  //   [EmployeeId];
  // });

  const handleInputChange = (e) => {
    setSelected(e.target.value);
    setSelectedReason("0");
  }; 

  const handleReasonChange = (e) => {
    const selectedIndex = e.target.selectedIndex;
    const selectedText = e.target.options[selectedIndex].text;
    setReason(selectedText);
    setSelectedReason(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const isValidFileType = (file) => {
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      return allowedTypes.includes(file.type);
    };
    
    const formData = new FormData();
    formData.append("selected", selected); 
    formData.append("selectedReason", selectedReason); 
    formData.append('currentEmployeeId', EmployeeId);

    if (selected === '0'){
      document.getElementById('deliveryType').style.border = '1px solid red';
      toast.error('Please select a delivery type.', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
      });
      return; // Stop further execution
    }else{
      document.getElementById('deliveryType').style.border = '';
    }

    if (selectedReason === '0'){
      document.getElementById('ReasonType').style.border = '1px solid red';
      toast.error('Please select a reason type.', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
      });
      return; // Stop further execution
    }else{
      document.getElementById('ReasonType').style.border = '';
    }

    if (selected === '1' || selected === '2') {
      if (thisInfo.EmailNotification && isValidFileType(thisInfo.EmailNotification)) {
          formData.append('EmailNotification', thisInfo.EmailNotification);
          document.getElementById('EmailNotification').style.border = '';
      } else {
          document.getElementById('EmailNotification').style.border = '1px solid red';
          toast.error('Invalid file type. Please check your file you uploaded.', {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
          });
          return; 
      }
    } else if (selected === '3' || selected === '4') {
        if (thisInfo.ProvidentApplicationForm && isValidFileType(thisInfo.ProvidentApplicationForm)) {
            formData.append('ProvidentApplicationForm', thisInfo.ProvidentApplicationForm);
            document.getElementById('ProvidentApplicationForm').style.border = '';
        } else {
            document.getElementById('ProvidentApplicationForm').style.border = '1px solid red';
            toast.error('Invalid file type. Please check your file you uploaded.', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return; 
        }
      }

    try {
      const response = await fetch('/PHILHEALTHrequest', {
          method: 'POST',
          body: formData,
      });
  
      if (response.ok) {
          const jsonResponse = await response.json();
  
          SendEmailNotification()

          console.log(jsonResponse.message);
           // Emit success toast
           toast.success('Thank you! Your request has been submitted.', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          
          if(selected === '1' || selected === '2'){
              // Clear file input fields
            document.getElementById('EmailNotification').value = null;
            setThisInfo({
              EmailNotification: ''
            });
          }else if(selected === '3' || selected === '4'){
            document.getElementById('ProvidentApplicationForm').value = null;
            setThisInfo({
              ProvidentApplicationForm: ''
            });  
          }
         
        } else {
            console.error('Failed to submit request:', response.statusText);
            toast.error('Failed to Submit', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    } catch (error) {
        console.error('Error uploading:', error);
    }
  };

  const handleEmailNotification = (e) => {
    setThisInfo({ ...thisInfo, EmailNotification: e.target.files[0] });
  };

  const handleProvidentApplicationForm = (e) => {
    setThisInfo({ ...thisInfo, ProvidentApplicationForm: e.target.files[0] });
  };
  

  const SendEmailNotification= () => {
        
    const content = {
        HrName: '',
        HrEmail: '', // hr's email
        Name: sessionStorage.getItem("firstName") + " " + sessionStorage.getItem("lastName"),
        EmailAddress: sessionStorage.getItem("email"), // employee's email
        TransactionType: 'SSS Loan',
        documentName: '',
        reason: reason,
        stopDeduction: true,
        facility: sessionStorage.getItem("facility")
    };

    console.log(content); 
    
    sendEmail('submit',content)
  };


    return (
      <div id="wrapper">
          <Navbar />
          <div id="content-wrapper" className="d-flex flex-column">
              <div id="content">
                <TopNavbar />
                <div className="container-fluid">
                    <div className="row justify-content-center">
                      <h4 className="m-0 font-weight-bold text-primary header-name">Certification Request ( PHILHEALTH )</h4>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                        {/* page content begin here */}
                        <div className="container-fluid">
                            <div className="row justify-content-center">
                                <div className="col-xl-8 col-lg-7">
                                    <div className="card shadow mb-4">
                                        {/* Card Header - New Hire Upload */}
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">Request for Loan Deletion (Stop Deduction)</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body">
                                            <div className="">
                                                <div className="">
                                                    <div className="">
                                                        <label> Stop Deduction Request Cut-Off is every 29th and 14th of the month, all requests after that will be carried out on the next cut-off. </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Page content ends here */}
                      {/* page content begin here */}
                      <div className="container-fluid">
                        <div className="row justify-content-center">
                          <div className="col-xl-8 col-lg-7">
                            <div className="card shadow mb-4">
                              
                              {/* Card Body - New Hire Options */}
                              <div className="card-body">
                                <div className="tab-content card-tab">
                                  <div className="card-body">
                                    <div className="d-flex justify-content-left">
                                      <div className="form-group">
                                        <label htmlFor="deliveryType">Stop deduction for: *</label>
                                        <select className="form-control" id="deliveryType" name="deliveryType" value={selected} onChange={handleInputChange}>
                                          <option value="0">Select Type</option>
                                          <option value="1">SSS Salary Loan</option>
                                          <option value="2">SSS Calamity Loan</option>
                                          <option value="3">PAG-IBIG Salary Loan </option>
                                          <option value="4">PAG-IBIG Calamity Loan </option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                  {/* Vertical line */}
                                  <div className="vertical-line"></div>
                                    <div className="card-body">
                                      <div className="d-flex justify-content-left ">
                                        { selected === "0" && (
                                          <div className="no-selected">
                                            <label >Select a type of request.</label>  
                                          </div>
                                        )}
                                        { selected === "1" && selected !== "0" && (
                                            <div className="">
                                                <div className="form-group">
                                                    <label htmlFor="deliveryType">Reason for Loan Deletion *</label>
                                                    <select 
                                                        className="form-control" 
                                                        id="ReasonType" 
                                                        name="deliveryType" 
                                                        value={selectedReason} 
                                                        onChange={handleReasonChange}
                                                    >
                                                        <option value="0">Select Type</option>
                                                        <option value="1">Loan is Fully-Paid</option>
                                                        <option value="2">Due to Re-Loan</option>
                                                    </select>
                                                </div>
                                                
                                                {selectedReason === "1" && selectedReason !== "0" && (
                                                    <div>
                                                        <div className="form-group">
                                                            <label style={{ fontSize: '14px' }}>Email Notification from SSS (Non-anonymous question) *</label>
                                                            <input 
                                                                id="EmailNotification" 
                                                                type="file" 
                                                                className="form-control-file" 
                                                                aria-describedby="fileHelp" 
                                                                onChange={handleEmailNotification} 
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {selectedReason === "2" && selectedReason !== "0" && (
                                                    <div>
                                                        <div className="form-group">
                                                            <label style={{ fontSize: '14px' }}>Email Notification from SSS (Non-anonymous question) *</label>
                                                            <input 
                                                                id="EmailNotification" 
                                                                type="file" 
                                                                className="form-control-file" 
                                                                aria-describedby="fileHelp" 
                                                                onChange={handleEmailNotification} 
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                          )}
                                        { selected === "2" && selected !== "0" && (
                                            <div className="">
                                                <div className="form-group">
                                                    <label htmlFor="deliveryType">Reason for Loan Deletion *</label>
                                                    <select 
                                                        className="form-control" 
                                                        id="ReasonType" 
                                                        name="deliveryType" 
                                                        value={selectedReason} 
                                                        onChange={handleReasonChange}
                                                    >
                                                        <option value="0">Select Type</option>
                                                        <option value="1">Loan is Fully-Paid</option>
                                                        <option value="2">Due to Re-Loan</option>
                                                    </select>
                                                </div>
                                                
                                                {selectedReason === "1" && selectedReason !== "0" && (
                                                    <div>
                                                        <div className="form-group">
                                                            <label style={{ fontSize: '14px' }}>Email Notification from SSS (Non-anonymous question) *</label>
                                                            <input 
                                                                id="EmailNotification" 
                                                                type="file" 
                                                                className="form-control-file" 
                                                                aria-describedby="fileHelp" 
                                                                onChange={handleEmailNotification} 
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {selectedReason === "2" && selectedReason !== "0" && (
                                                    <div>
                                                        <div className="form-group">
                                                            <label style={{ fontSize: '14px' }}>Email Notification from SSS (Non-anonymous question) *</label>
                                                            <input 
                                                                id="EmailNotification" 
                                                                type="file" 
                                                                className="form-control-file" 
                                                                aria-describedby="fileHelp" 
                                                                onChange={handleEmailNotification} 
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                          )}
                                          { selected === "3" && selected  !== "0" && (
                                            <div className="">
                                              <div className="form-group">
                                                  <label htmlFor="deliveryType">Reason for stoppage *</label>
                                                  <select 
                                                      className="form-control" 
                                                      id="ReasonType" 
                                                      name="deliveryType" 
                                                      value={selectedReason} 
                                                      onChange={handleReasonChange}
                                                  >
                                                      <option value="0">Select Type</option>
                                                      <option value="1">Provident Fund</option>
                                                      <option value="2">Reloan</option>
                                                  </select>
                                              </div>
                                              
                                              {selectedReason === "1" && selectedReason !== "0" && (
                                                  <div>
                                                      <div className="form-group">
                                                          <label style={{ fontSize: '14px' }}>Provident Application Form duly received by PAG-IBIG (Non-anonymous question)*</label>
                                                          <input 
                                                              id="ProvidentApplicationForm" 
                                                              type="file" 
                                                              className="form-control-file" 
                                                              aria-describedby="fileHelp" 
                                                              onChange={handleProvidentApplicationForm} 
                                                          />
                                                          <button style={{ fontSize: '12px', border: 'none', background: 'none'}} type="button">
                                                              <a href="https://www.pagibigfund.gov.ph/document/pdf/diforms/providentrelated/PFF285_Application%20Provident%20BenefitsCla%20im_V07.pdf" target="_blank" rel="noopener noreferrer">Download Form here.</a>
                                                          </button>
                                                      </div>
                                                  </div>
                                              )}
                                              {selectedReason === "2" && selectedReason !== "0" && (
                                                  <div>
                                                      <div className="form-group">
                                                          <label style={{ fontSize: '14px' }}>Screenshot/Image of Text Notification from PAG-IBIG (Non-anonymous question) *</label>
                                                          <input 
                                                              id="ProvidentApplicationForm" 
                                                              type="file" 
                                                              className="form-control-file" 
                                                              aria-describedby="fileHelp" 
                                                              onChange={handleProvidentApplicationForm} 
                                                          />
                                                      </div>
                                                  </div>
                                              )}
                                          </div>
                                        )}
                                        { selected === "4" && selected  !== "0" && (
                                            <div className="">
                                              <div className="form-group">
                                                  <label htmlFor="deliveryType">Reason for stoppage *</label>
                                                  <select 
                                                      className="form-control" 
                                                      id="ReasonType" 
                                                      name="deliveryType" 
                                                      value={selectedReason} 
                                                      onChange={handleReasonChange}
                                                  >
                                                      <option value="0">Select Type</option>
                                                      <option value="1">Provident Fund</option>
                                                      <option value="2">Reloan</option>
                                                  </select>
                                              </div>
                                              
                                              {selectedReason === "1" && selectedReason !== "0" && (
                                                  <div>
                                                      <div className="form-group">
                                                          <label style={{ fontSize: '14px' }}>Provident Application Form duly received by PAG-IBIG (Non-anonymous question) *</label>
                                                          <input 
                                                              id="ProvidentApplicationForm" 
                                                              type="file" 
                                                              className="form-control-file" 
                                                              aria-describedby="fileHelp" 
                                                              onChange={handleProvidentApplicationForm} 
                                                          />
                                                          <button style={{ fontSize: '12px', border: 'none', background: 'none'}} type="button">
                                                              <a href="https://www.pagibigfund.gov.ph/document/pdf/diforms/providentrelated/PFF285_ApplicationProvidentBenefitsClaim_V07.pdf" target="_blank" rel="noopener noreferrer">Download Form here.</a>
                                                          </button>
                                                      </div>
                                                  </div>
                                              )}
                                              {selectedReason === "2" && selectedReason !== "0" && (
                                                  <div>
                                                      <div className="form-group">
                                                          <label style={{ fontSize: '14px' }}>Screenshot/Image of Text Notification from PAG-IBIG (Non-anonymous question) *</label>
                                                          <input 
                                                              id="ProvidentApplicationForm" 
                                                              type="file" 
                                                              className="form-control-file" 
                                                              aria-describedby="fileHelp" 
                                                              onChange={handleProvidentApplicationForm} 
                                                          />
                                                      </div>
                                                  </div>
                                              )}
                                          </div>
                                        )}

                                        

                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Page content ends here */}
                        <label style={{ fontSize: '12px', marginLeft: '310px', width: '100%'}}>Note: File upload only accepts PDF, PNG, or JPEG file.</label>
                        <button type="submit" className="btn btn-primary d-block mx-auto loan-btn">Submit</button>
                    </form>
                  </div>
                </div>
              <Footer />
          </div>
          <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
      </div>
  );
}

export default SSSRequest;