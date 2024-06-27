import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../navbar';
import TopNavbar from '../topnavbar';
import Footer from '../footer';
import '../../App.css';
import { variables } from '../../variables';
import { sendEmail } from '../globalFunctions';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SSSRequest() {

  const EmployeeId = sessionStorage.getItem("employeeId");
  const Role = sessionStorage.getItem("role");

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [selected, setSelected] = useState("0");
  const [specifyOtherRequest, setSpecifyOtherRequest] = useState("");
  const [thisInfo, setThisInfo] = useState({
    StatementOfAccount: '',
    VerificationRequestForm: '',
    MonthlyContributions: '',
    deliveryType: ''
  });

  const [currentValue, setcurrentValue] = useState({
    currentLabel: '',
    currentLink: ''
  });



  //if selected is equals to 1
  const [SOA, setThisSOA] = useState({
    thisLabel: '',
    thisLink: ''
  });

  const [VF, setThisVF] = useState({
    thisLabel: '',
    thisLink: ''
  });


  const [SelectedLink, setSelectedLink] = useState({
    thisSelectedLink: ''
  });



  useEffect(() => {
    // [EmployeeId];
    handleSetLinks();
  });

  const handleInputChange = (e) => {
    setSelected(e.target.value);
    
    const { name, value } = e.target;
    setThisInfo({
      ...thisInfo,
      [name]: value
    });
  }; 

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const isValidFileType = (file) => {
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      return allowedTypes.includes(file.type);
    };
  
    const formData = new FormData();
    formData.append("selected", selected);
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

    if (selected === '1') {
      if (thisInfo.StatementOfAccount && isValidFileType(thisInfo.StatementOfAccount)) {
          document.getElementById('SOAinvalid').style.border = '';
          document.getElementById('FormInvalid').style.border = '';
          formData.append('StatementOfAccount', thisInfo.StatementOfAccount);
      } else {
        document.getElementById('SOAinvalid').style.border = '1px solid red';
        document.getElementById('FormInvalid').style.border = '';
          toast.error('Something went wrong. Please check your file you uploaded.', {
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
      }
  
      if (thisInfo.VerificationRequestForm && isValidFileType(thisInfo.VerificationRequestForm)) {
          document.getElementById('SOAinvalid').style.border = '';
          document.getElementById('FormInvalid').style.border = '';
          formData.append('VerificationRequestForm', thisInfo.VerificationRequestForm);
      } else {
        document.getElementById('SOAinvalid').style.border = '';
        document.getElementById('FormInvalid').style.border = '1px solid red';
        toast.error('Something went wrong. Please check your file you uploaded.', {
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
      }
  } else if (selected === '2') {
      if (thisInfo.MonthlyContributions && isValidFileType(thisInfo.MonthlyContributions)) {
        document.getElementById('ContributionsInvalid').style.border = '';
        document.getElementById('FormInvalid').style.border = '';
          formData.append('MonthlyContributions', thisInfo.MonthlyContributions);
      } else {
        document.getElementById('ContributionsInvalid').style.border = '1px solid red';
        document.getElementById('FormInvalid').style.border = '';
          toast.error('Something went wrong. Please check your file you uploaded.', {
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
  
      if (thisInfo.VerificationRequestForm && isValidFileType(thisInfo.VerificationRequestForm)) {
        document.getElementById('ContributionsInvalid').style.border = '';
        document.getElementById('FormInvalid').style.border = '';
        formData.append('VerificationRequestForm', thisInfo.VerificationRequestForm);
      } else {
        document.getElementById('ContributionsInvalid').style.border = '';
        document.getElementById('FormInvalid').style.border = '1px solid red';
          toast.error('Something went wrong. Please check your file you uploaded.', {
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
      } else if (selected === '3') {
          if(specifyOtherRequest !== ""){
            document.getElementById('RequestInvalid').style.border = '';
            document.getElementById('FormInvalid').style.border = '';
            formData.append('SpecifyOtherRequest', specifyOtherRequest); // Assuming no file validation required for this field
          }else{
              document.getElementById('RequestInvalid').style.border = '1px solid red';
              document.getElementById('FormInvalid').style.border = '';
              toast.error('Please input your other request.', {
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
      
          if (thisInfo.VerificationRequestForm && isValidFileType(thisInfo.VerificationRequestForm)) {
              document.getElementById('RequestInvalid').style.border = '';
              document.getElementById('FormInvalid').style.border = '';
              formData.append('VerificationRequestForm', thisInfo.VerificationRequestForm);
          } else {
            document.getElementById('RequestInvalid').style.border = '';
            document.getElementById('FormInvalid').style.border = '1px solid red';
              toast.error('Something went wrong. Please check your file you uploaded.', {
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
      const response = await fetch('/CertificationRequestSSS', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse.message);

        SendEmailNotification()


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

        setThisInfo({
          specifyOtherRequest: '',
          deliveryType: ''
        });
        setSelected("0");

        // Clear file input fields
        document.getElementById('deliveryType').value = null;
        document.getElementById('RequestInvalid').value = null;
        document.getElementById('Application_Form').value = null;

        // Clear the specify other request textarea
        setSpecifyOtherRequest('');

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

  const handleStatementOFAccount = (e) => {
    setThisInfo({ ...thisInfo, StatementOfAccount: e.target.files[0] });
  };

  const handleVerificationRequestForm = (e) => {
    setThisInfo({ ...thisInfo, VerificationRequestForm: e.target.files[0] });
  };

  const handleMonthlyContributions = (e) => {
    setThisInfo({ ...thisInfo, MonthlyContributions: e.target.files[0] });
  };

  const handleOtherRequestChange = (event) => {
    setSpecifyOtherRequest(event.target.value);
  };

  const handleUpdateLinks = (e) => {
    setSelectedLink({ ...SelectedLink, thisSelectedLink: e.target.value });
    handleShowModal();
  };
  


  const selectedSOA = (e) => {
    e.preventDefault();
    setcurrentValue(prevState => ({
      ...prevState,
      currentLabel: "SSS SOA",
      currentLink: e.target.value
    }));
  };

  const selectedVF = (e) => {
    e.preventDefault();
    setcurrentValue(prevState => ({
      ...prevState,
      currentLabel: "SSS VF",
      currentLink: e.target.value
    }));
  };
  

  const handleLink = async (e) => {
    try {
      e.preventDefault();

       // Check if the textarea value is empty
       if (currentValue.currentLink.trim() === '') {
        // Show an error message or handle the empty case as needed
        console.error('Textarea is empty. Please enter a URL.');
        toast.error('Please enter a URL', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        return; // Exit the function if the textarea is empty
    }

      const formData = new FormData();
      formData.append("updatethisLabel", currentValue.currentLabel);
      formData.append("updatethisLink", currentValue.currentLink);
      
      const response = await fetch('/UpdateLink', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const jsonResponse = await response.json();

        console.log(jsonResponse.message);

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
        handleSetLinks();
        handleCloseModal();
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
        console.error('Error fetching links:', error);
    }
  };

  const handleSetLinks = async () => {
    try {
        const response = await fetch('/setLink', {
            method: 'POST'
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            // console.log(jsonResponse.message);

            // Handle the received data as needed
            const url = jsonResponse.data;

            setThisSOA({
              thisLabel: url[0].LinkName,
              thisLink: url[0].LinkURL
            });
            setThisVF({
              thisLabel: url[1].LinkName,
              thisLink: url[1].LinkURL
            });
            
        }
      } catch (error) {
          console.error('Error fetching links:', error);
      }
    };

    const SendEmailNotification= () => {
          
      const content = {
          HrName: '',
          HrEmail: '', // hr's email
          Name: sessionStorage.getItem("firstName") + " " + sessionStorage.getItem("lastName"),
          EmailAddress: sessionStorage.getItem("email"), // employee's email
          TransactionType: 'Certification Request: SSS',
          documentName: '',
          reason: '',
          stopDeduction: false,
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
              <h4 className="m-0 font-weight-bold text-primary header-name">Certification Request ( SSS )</h4>
            </div>
            <form onSubmit={handleFormSubmit}>
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
                                <label htmlFor="deliveryType">SSS Request for: </label>
                                <select className="form-control" id="deliveryType" name="deliveryType" value={thisInfo.deliveryType} onChange={handleInputChange}>
                                  <option value="0" >Select Type</option>
                                  <option value="1">Unposted Loan Payment</option>
                                  <option value="2">Unposted Contribution</option>
                                  <option value="3">Other information Update Request</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          {/* Vertical line */}
                          <div className="vertical-line"></div>
                          <div className="card-body">
                            <div className="d-flex justify-content-left ">
                              {selected === "0" && (
                                <div className="no-selected">
                                  <label >Select a type of request.</label>
                                </div>
                              )}
                              {selected === "1" && selected !== "0" && (
                                <div className="row justify-content-left content-holder">
                                  <div className="form-group">
                                    <label htmlFor="middleName">Unposted Loan Payment</label>
                                  </div>
                                  <div className="form-group" >
                                    <label style={{ fontSize: '14px' }}>Upload Latest Statement of Account (Non-anonymous question) *</label>
                                    <input id='SOAinvalid' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleStatementOFAccount} />
                                    <button style={{ fontSize: '12px', border: 'none', background: 'none' }} type="button">
                                      <a href={SOA.thisLink} target="_blank" rel="noopener noreferrer">How to download SSS SOA</a>
                                    </button>
                                    {Role !== 'Employee' && (
                                      <button style={{ fontSize: '12px', border: '1px solid #ccc', padding: '1px 5px', cursor: 'pointer', marginLeft: '3px' }} type="button" value="showModalSOA" onClick={handleUpdateLinks}>
                                        Update 
                                      </button>
                                    )}
                                  </div>

                                  <div style={{ border: '1px solid #ccc', marginTop: '5px', marginBottom: '5px' }} />

                                  <div className="form-group" >
                                    <label style={{ fontSize: '14px' }}>Upload "Request/Verification Form" (Non-anonymous question) *</label>
                                    <input id='FormInvalid' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleVerificationRequestForm} />
                                    <button style={{ fontSize: '12px', border: 'none', background: 'none' }} type="button">
                                      <a href={VF.thisLink} target="_blank" rel="noopener noreferrer">View Form</a>
                                    </button>
                                    {Role !== 'Employee' && (
                                      <button style={{ fontSize: '12px', border: '1px solid #ccc', padding: '1px 5px', cursor: 'pointer', marginLeft: '3px' }} type="button" value="showModalVF" onClick={handleUpdateLinks}>
                                          Update
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}

                              {selected === '2' && selected !== '0' && selected !== '1' && (
                                <div className="row justify-content-left content-holder">
                                  <div className="form-group">
                                    <label htmlFor="middleName">Unposted Contribution</label>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="middleName">Upload Latest Monthly Contributions (Non-anonymous question) *</label>
                                    <input id='ContributionsInvalid' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleMonthlyContributions} />
                                  </div>

                                  <div style={{ border: '1px solid #ccc', marginTop: '5px', marginBottom: '5px' }} />

                                  <div className="form-group">
                                    <label style={{ fontSize: '14px' }}>Upload "Request/Verification Form" (Non-anonymous question) *</label>
                                    <input id='FormInvalid' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleVerificationRequestForm} />
                                    <button style={{ fontSize: '12px', border: 'none', background: 'none' }} type="button">
                                      <a href={VF.thisLink} target="_blank" rel="noopener noreferrer">View Form</a>
                                    </button>
                                    {Role !== 'Employee' && (
                                      <button style={{ fontSize: '12px', border: '1px solid #ccc', padding: '1px 5px', cursor: 'pointer', marginLeft: '3px' }} type="button" value="showModalVF" onClick={handleUpdateLinks}>
                                          Update
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}

                              {selected === '3' && selected !== '0' && selected !== '1' && selected !== '2' && (
                                <div className="row justify-content-left content-holder">
                                  <div className="form-group">
                                    <label htmlFor="middleName">Other Information Update Request</label>
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="middleName">Specify Other Request *</label>

                                    <textarea
                                                            type="text"
                                                            className="form-control text-black-100"
                                                            style={{ height: '40px' }}
                                                            id='RequestInvalid'
                                                            value={specifyOtherRequest}
                                                            onChange={handleOtherRequestChange}
                                                            placeholder="Type here..."
                                                        />
                                  </div>

                                  <div style={{ border: '1px solid #ccc', marginTop: '5px', marginBottom: '5px' }} />

                                  <div className="form-group">
                                    <label style={{ fontSize: '14px' }}>Upload "Request/Verification Form" (Non-anonymous question) *</label>
                                    <input id='FormInvalid' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleVerificationRequestForm} />
                                    <button style={{ fontSize: '12px', border: 'none', background: 'none' }} type="button">
                                      <a href={VF.thisLink} target="_blank" rel="noopener noreferrer">View Form</a>
                                    </button>
                                    {Role !== 'Employee' && (
                                      <button style={{ fontSize: '12px', border: '1px solid #ccc', padding: '1px 5px', cursor: 'pointer', marginLeft: '3px' }} type="button" value="showModalVF" onClick={handleUpdateLinks}>
                                          Update
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Page content ends here */}
                <label style={{ fontSize: '12px', marginLeft: '310px', width: '100%'}}>Note: File upload only accepts PDF, PNG, or JPEG file.</label>
                <button type="submit" className="btn btn-primary d-block mx-auto loan-btn">Update</button>
              </div>
            </form>
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
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header >
          <Modal.Title>Update Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {SelectedLink.thisSelectedLink === "showModalSOA" ? (
              <form onSubmit={handleLink}>
                {/* Page content begins here */}
                      <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-xl-12 col-lg-8">
                                {/* First Card */}
                                <div className="card shadow mb-4">
                                    {/* Card Header */}
                                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 className="m-0 text-primary">SSS Statement of Account Link</h6>
                                    </div>
                                    {/* Card Body */}    
                                </div>
                                {/* Second Card */}
                                <div className="card shadow mb-4">
                                    {/* Card Header */}
                                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 className="m-0 font-weight-bold text-primary">URL / Link</h6>
                                    </div>
                                    {/* Card Body */}
                                    <div className="card-body">
                                        <div className="tab-content">
                                            <textarea
                                                className="form-control text-gray-700"
                                                style={{ height: '100px' }} // This line sets the height to 100px
                                                value={currentValue.currentLink}
                                                onChange={selectedSOA}
                                                placeholder={SOA.thisLink}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  {/* Page content ends here */}
                  <button className="btn btn-primary d-block mx-auto loan-btn">Update</button>
              </form>
            ) : SelectedLink.thisSelectedLink === "showModalVF" ? (
              <form onSubmit={handleLink}>
                {/* Page content begins here */}
                      <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-xl-12 col-lg-8">
                                {/* First Card */}
                                <div className="card shadow mb-4">
                                    {/* Card Header */}
                                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 className="m-0 text-primary">Request/Verification Form Link</h6>
                                    </div>
                                    {/* Card Body */}    
                                </div>
                                {/* Second Card */}
                                <div className="card shadow mb-4">
                                    {/* Card Header */}
                                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 className="m-0 font-weight-bold text-primary">URL / Link</h6>
                                    </div>
                                    {/* Card Body */}
                                    <div className="card-body">
                                        <div className="tab-content">
                                            <textarea
                                                className="form-control text-gray-700"
                                                style={{ height: '100px' }} // This line sets the height to 100px
                                                value={currentValue.currentLink}
                                                onChange={selectedVF}
                                                placeholder={VF.thisLink}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  {/* Page content ends here */}
                  <label style={{ fontSize: '12px', marginLeft: '310px', width: '100%'}}>Note: File upload only accepts PDF, PNG, or JPEG file.</label>
                  <button className="btn btn-primary d-block mx-auto loan-btn">Update</button>
              </form>
            ) : (
              <div>
                <p>No specific link selected.</p>
              </div>
            )}
            <label style={{fontSize: '12px'}}>Note: Before you paste your link, please make sure to copy the entire URL or link.</label>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {/* Add any additional buttons or actions here */}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SSSRequest;