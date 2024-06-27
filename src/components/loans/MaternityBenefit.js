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

 function MaternityBenefit() {
   
    const EmployeeId = sessionStorage.getItem("employeeId");
    const Role = sessionStorage.getItem("role");
    
    const [selected, setSelected] = useState("0")
    const [thisInfo, setThisInfo] = useState({
      Application_Form: '',
      LiveBirthCert: '',
      SoloParent: '',
      ProofPregnancy: '',
      HospitalRec: '',
      DeathCert: '',
      deliveryType: ''
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

    const [MRA, setThisMRA] = useState({
      thisLabel: '',
      thisLink: ''
    });


    const selectedMRA = (e) => {
      e.preventDefault();
      setcurrentValue(prevState => ({
        ...prevState,
        currentLabel: "SSS MRA",
        currentLink: e.target.value
      }));
    };

    useEffect(() => {
      // [EmployeeId];
      handleSetLinks();
    } );
  
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
  
      const formData = new FormData();
      formData.append('currentEmployeeId', EmployeeId);
      formData.append("selected", selected); // Assuming selected is defined
      formData.append('Application_Form', thisInfo.Application_Form); // Assuming thisInfo.Application_Form is defined
  
      const validFileTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  
      const validateFileType = (file) => {
          return validFileTypes.includes(file.type);
      };
  
      if (!validateFileType(thisInfo.Application_Form)) {
        document.getElementById('AppFormInvalid').style.border = '1px solid red';
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
      }else{
        document.getElementById('AppFormInvalid').style.border = '';
      }
      
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
    
      // Append other files based on selected option
      if (selected === '1') {
          if (!validateFileType(thisInfo.LiveBirthCert) || !validateFileType(thisInfo.SoloParent)) {
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
          formData.append('LiveBirthCert', thisInfo.LiveBirthCert);
          formData.append('SoloParent', thisInfo.SoloParent);
      } else if (selected === '2') {
          if (!validateFileType(thisInfo.ProofPregnancy) || !validateFileType(thisInfo.HospitalRec)) {
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
          formData.append('ProofPregnancy', thisInfo.ProofPregnancy);
          formData.append('HospitalRec', thisInfo.HospitalRec);
      } else if (selected === '3') {
          if (!validateFileType(thisInfo.DeathCert)) {
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
          formData.append('DeathCert', thisInfo.DeathCert);
      }
  
      try {
          const response = await fetch('/MaternityBenefit', {
              method: 'POST',
              body: formData,
          });
  
          if (response.ok) {
              const jsonResponse = await response.json();
              console.log(jsonResponse.message);

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
  
              setThisInfo({
                  Application_Form: '',
                  LiveBirthCert: '',
                  SoloParent: '',
                  ProofPregnancy: '',
                  HospitalRec: '',
                  DeathCert: '',
                  deliveryType: ''
              });
  
              // Clear file input fields
              document.getElementById('deliveryType').value = null;
              setSelected("0");
              document.getElementById('Application_Form').value = null;
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
  

    const handleApplicationForm = (e) => {
      setThisInfo({ ...thisInfo, Application_Form: e.target.files[0] });
    };
    const handleLiveBirthCert = (e) => {
      setThisInfo({ ...thisInfo, LiveBirthCert: e.target.files[0] });
    };
    const handleSoloParent = (e) => {
      setThisInfo({ ...thisInfo, SoloParent: e.target.files[0] });
    };
    const handleProofPregnancy = (e) => {
      setThisInfo({ ...thisInfo, ProofPregnancy: e.target.files[0] });
    };
    const handleHospitalRec = (e) => {
      setThisInfo({ ...thisInfo, HospitalRec: e.target.files[0] });
    };
    const handleDeathCert = (e) => {
      setThisInfo({ ...thisInfo, DeathCert: e.target.files[0] });
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
              
              setThisMRA({
                thisLabel: url[5].LinkName,
                thisLink: url[5].LinkURL
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
            TransactionType: 'Maternity Benefit',
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
                      <h4 className="m-0 font-weight-bold text-primary header-name">Maternity Benefit</h4>
                    </div>
                    <form onSubmit={handleFormSubmit}>

                      {/* page content begin here */}
                      <div className="container-fluid">
                        <div className="row justify-content-center">
                          <div className="col-xl-8 col-lg-7">
                            <div className="card shadow mb-4">
                              {/* Card Header - New Hire Upload */}
                              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 className="m-0 font-weight-bold text-primary">SSS Maternity Reimbursement Application Form</h6>
                              </div>
                              {/* Card Body - New Hire Options */}
                              <div className="card-body" id='AppFormInvalid'>
                                <div className="tab-content">
                                    <div className="d-flex justify-content-left">
                                      <input type="file" className="input-file" aria-describedby="fileHelp" onChange={handleApplicationForm} id='Application_Form'/>
                                      <small id="fileHelp" className="form-text text-muted">Choose a file to upload.</small>
                                  </div>
                                      <button style={{ fontSize: '12px', border: 'none', background: 'none', marginBottom: '15px' }} type="button">
                                        <a href={MRA.thisLink} target="_blank" rel="noopener noreferrer">Please see link for the steps/process</a>
                                      </button>
                                      {Role !== 'Employee' && (
                                        <button style={{ fontSize: '12px', border: '1px solid #ccc', padding: '1px 5px', cursor: 'pointer', marginLeft: '3px' }} type="button" value="showMaternityReimbursementApplication" onClick={handleUpdateLinks}>
                                          Update 
                                        </button>
                                      )}
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
                                <h6 className="m-0 font-weight-bold text-primary">Delivery</h6>
                              </div>
                              {/* Card Body - New Hire Options */}
                              <div className="card-body">
                                <div className="tab-content card-tab">
                                  <div className="card-body">
                                    <div className="d-flex justify-content-left">
                                      <div className="form-group">
                                        <label htmlFor="deliveryType">Type of Delivery</label>
                                        <select className="form-control" id="deliveryType" name="deliveryType" value={thisInfo.deliveryType} onChange={handleInputChange}>
                                          <option value="0" >Select Type</option>
                                          <option value="1">Live Child Birth</option>
                                          <option value="2">Miscarriage/ Emergency Termination of Pregnancy/ Ectopic Pregnancy</option>
                                          <option value="3">Still Birth/ Fetal Death</option>
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
                                            <label >Select a type of delivery</label>  
                                          </div>
                                        )}
                                        { selected === "1" && selected  !== "0" && (
                                        <div className="row justify-content-left content-holder">
                                          <div className="form-group">
                                            <label htmlFor="middleName">Live Childbirth</label>  
                                          </div>
                                          <div className="form-group">
                                            <label style={{ fontSize: '14px' }}>Proof of Child's Birth (Live Birth Certificate)</label>
                                            <input id='LiveBirthCert' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleLiveBirthCert}/>
                                            <small id="fileHelp" className="form-text text-muted">Choose a file to upload.</small>
                                          </div>

                                          <div style={{ border: '1px solid #ccc', marginTop: '5px', marginBottom: '5px' }} />

                                          <div className="form-group">
                                            <label style={{ fontSize: '14px' }}>Solo Parent ID or Certificate of Eligibility (Solo Parent only)</label> 
                                            <input id='SoloParent' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleSoloParent}/>
                                            <small id="fileHelp" className="form-text text-muted">Choose a file to upload.</small>
                                          </div>
                                        </div> 
                                        )}
                                         
                                        { selected === '2' && selected !== '0' && selected !== '1' && (
                                        <div className="row justify-content-left content-holder">
                                          <div className="form-group">
                                          <label htmlFor="middleName">Miscarriage/ Emergency Termination of Pregnancy/ Ectopic Pregnancy</label> 
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="middleName">Proof of Pregnancy</label> 
                                            <input id='ProofPregnancy' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleProofPregnancy}/>
                                            <small id="fileHelp" className="form-text text-muted">Choose a file to upload.</small>
                                          </div>

                                          <div style={{ border: '1px solid #ccc', marginTop: '5px', marginBottom: '5px' }} />
                                          
                                          <div className="form-group">
                                            <label htmlFor="middleName">Proof of Termination of Pregnancy/ Hospital Record</label> 
                                            <input id='HospitalRec' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleHospitalRec}/>
                                            <small id="fileHelp" className="form-text text-muted">Choose a file to upload.</small>
                                          </div>
                                        </div>  
                                        )}

                                        { selected === '3' && selected !== '0' && selected !== '1' && selected !== '2' && (
                                        <div className="row justify-content-left content-holder">
                                          <div className="form-group">
                                          <label htmlFor="middleName">Still Birth/Fetal Death</label> 
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="middleName">Fetal Certificate of Death/ Hospital/ Medical Records</label> 
                                            <input id='DeathCert' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleDeathCert}/>
                                            <small id="fileHelp" className="form-text text-muted">Choose a file to upload.</small>
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
            <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header >
              <Modal.Title>Update Link</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {SelectedLink.thisSelectedLink === "showMaternityReimbursementApplication" ? (
                  <form onSubmit={handleLink}>
                    {/* Page content begins here */}
                          <div className="container-fluid">
                            <div className="row justify-content-center">
                                <div className="col-xl-12 col-lg-8">
                                    {/* First Card */}
                                    <div className="card shadow mb-4">
                                        {/* Card Header */}
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 text-primary">SSS Maternity Reimbursement Application Form</h6>
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
                                                    onChange={selectedMRA}
                                                    placeholder={MRA.thisLink}
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

export default MaternityBenefit;