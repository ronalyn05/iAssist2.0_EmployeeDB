import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../navbar';
import TopNavbar from '../topnavbar';
import Footer from '../footer';
import '../../App.css';
import { sendEmail } from '../globalFunctions';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function SicknessApproval() {

    const EmployeeId = sessionStorage.getItem("employeeId");
    const Role = sessionStorage.getItem("role");

    const [thisInfo, setThisInfo] = useState({
        SicknessEligibility: "",
        BankAccount: ""
    });

    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const [SelectedLink, setSelectedLink] = useState({
      thisSelectedLink: ''
    });

    const [currentValue, setcurrentValue] = useState({
      currentLabel: '',
      currentLink: ''
    });

    const [SE, setThisSE] = useState({
      thisLabel: '',
      thisLink: ''
    });


    const selectedSE = (e) => {
      e.preventDefault();
      setcurrentValue(prevState => ({
        ...prevState,
        currentLabel: "SSS SE",
        currentLink: e.target.value
      }));
    };

    useEffect(() => {
        // [EmployeeId]
        handleSetLinks();
    });

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('currentEmployeeId', EmployeeId);
        
        const isValidFileType = (file) => {
            const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
            return allowedTypes.includes(file.type);
        };

        if (thisInfo.SicknessEligibility && isValidFileType(thisInfo.SicknessEligibility)) {
            formData.append("SicknessEligibility", thisInfo.SicknessEligibility);

            document.getElementById('SicknessEligibilityInvalid').style.border = '';
            document.getElementById('BankAccountInvalid').style.border = '';

        } else {
            document.getElementById('SicknessEligibilityInvalid').style.border = '1px solid red';
            document.getElementById('BankAccountInvalid').style.border = '';
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
            return; // Stop further execution
        }

        const inputValue = parseInt(thisInfo.BankAccount); 
        if (!isNaN(inputValue)) {
            formData.append("BankAccount", thisInfo.BankAccount);

            document.getElementById('SicknessEligibilityInvalid').style.border = '';
            document.getElementById('BankAccountInvalid').style.border = '';
        } else {

            document.getElementById('SicknessEligibilityInvalid').style.border = '';
            document.getElementById('BankAccountInvalid').style.border = '1px solid red';
            toast.error('Something went wrong. Please check your Bank account number inputed.', {
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

        try {
            const response = await fetch('/SicknessApproval', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                const jsonResponse = await response.json();
                console.log(jsonResponse.message);
    
                setThisInfo({
                    SicknessEligibility: '',
                    BankAccount: ''
                });
    
                // Clear file input fields
                document.getElementById('SicknessEligibility').value = null;
                document.getElementById('BankAccount').value = null;
    
                SendEmailNotification()

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
    }
    const handleBankAccount   = (e) => {
        setThisInfo({ ...thisInfo, BankAccount : e.target.value });
    };
    const handleSicknessEligibility = (e) => {
        setThisInfo({ ...thisInfo, SicknessEligibility: e.target.files[0] });
    };

    const handleUpdateLinks = (e) => {
        setSelectedLink({ ...SelectedLink, thisSelectedLink: e.target.value });
        handleShowModal();
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
    
            toast.success('Thank you! The link has been successfully updated.', {
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
                console.log(url);
                
                setThisSE({
                  thisLabel: url[7].LinkName,
                  thisLink: url[7].LinkURL
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
              TransactionType: 'SSS Sickness Approval',
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
                            <h4 className="m-0 font-weight-bold text-primary header-name">SSS Sickness Approval</h4>
                        </div>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                        {/* page content begin here */}
                        <div className="container-fluid">
                            <div className="row justify-content-center">
                                <div className="col-xl-8 col-lg-7">
                                    <div className="card shadow mb-4">
                                        {/* Card Header - New Hire Upload */}
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">Sickness Eligibility (Non-anonymous question) *</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body" id='SicknessEligibilityInvalid'>
                                            <div className="">
                                                <div className="">
                                                    <input id='SicknessEligibility' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleSicknessEligibility} />
                                                    <button style={{ fontSize: '12px', border: 'none', background: 'none' }} type="button">
                                                        How to generate Sickness Eligibility: <a href={SE.thisLink} target="_blank" rel="noopener noreferrer">SSS Sickness Eligibility</a>
                                                    </button>
                                                    {Role !== 'Employee' && (
                                                        <button style={{ fontSize: '12px', border: '1px solid #ccc', padding: '1px 5px', cursor: 'pointer', marginLeft: '3px' }} type="button" value="showSicknessEligibility" onClick={handleUpdateLinks}>
                                                            Update 
                                                        </button>
                                                    )}
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
                                        {/* Card Header - New Hire Upload */}
                                            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                                <h6 className="m-0 font-weight-bold text-primary">BDO BANK ACCOUNT NUMBER *</h6>
                                            </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body" id='BankAccountInvalid'>
                                            <div className="tab-content">
                                                <div className="card-body">
                                                    <div className="form-group">
                                                        <textarea
                                                            className="form-control text-gray-700"
                                                            style={{ height: '40px' }} // This line sets the height to 100px
                                                            id="BankAccount"
                                                            name="BankAccount"
                                                            value={thisInfo.BankAccount}
                                                            onChange={handleBankAccount}
                                                            placeholder="Type here..."
                                                        />
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
            <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header >
              <Modal.Title>Update Link</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {SelectedLink.thisSelectedLink === "showSicknessEligibility" ? (
                  <form onSubmit={handleLink}>
                    {/* Page content begins here */}
                          <div className="container-fluid">
                            <div className="row justify-content-center">
                                <div className="col-xl-12 col-lg-8">
                                    {/* First Card */}
                                    <div className="card shadow mb-4">
                                        {/* Card Header */}
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 text-primary">SSS Sickness Notification Form</h6>
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
                                                    onChange={selectedSE}
                                                    placeholder={SE.thisLink}
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

export default SicknessApproval;