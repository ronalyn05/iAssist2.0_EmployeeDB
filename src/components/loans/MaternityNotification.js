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

 function MaternityNotification() {
   
    const EmployeeId = sessionStorage.getItem("employeeId");
    const Role = sessionStorage.getItem("role");

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

    const [MNF, setThisMNF] = useState({
      thisLabel: '',
      thisLink: ''
    });
    const [ME, setThisME] = useState({
      thisLabel: '',
      thisLink: ''
    });
    const [AMLC, setThisAMLC] = useState({
      thisLabel: '',
      thisLink: ''
    });


    const selectedMNF = (e) => {
      e.preventDefault();
      setcurrentValue(prevState => ({
        ...prevState,
        currentLabel: "SSS MNF",
        currentLink: e.target.value
      }));
    };
    const selectedME = (e) => {
      e.preventDefault();
      setcurrentValue(prevState => ({
        ...prevState,
        currentLabel: "SSS ME",
        currentLink: e.target.value
      }));
    };
    const selectedAMLC = (e) => {
      e.preventDefault();
      setcurrentValue(prevState => ({
        ...prevState,
        currentLabel: "SSS AMLC",
        currentLink: e.target.value
      }));
    };

    const [thisInfo, setThisInfo] = useState({
      Notication_Form: '',
      Maternity_Eligibility: '',
      Credit_Form: '',
      Medical_Reports: ''
    });

    useEffect(() => {
      // [EmployeeId]
      handleSetLinks();
    });


    const handleFormSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();

      // Function to validate file type
      const isValidFileType = (file) => {
        const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
        return allowedTypes.includes(file.type);
      };
    
      if (thisInfo.Notication_Form && isValidFileType(thisInfo.Notication_Form)) {
        document.getElementById('NotificationFormInvalid').style.border = '';
        document.getElementById('MaternityEligibilityInvalid').style.border = '';
        document.getElementById('CreditFormInvalid').style.border = '';
        document.getElementById('MedicalReportInvalid').style.border = '';
        formData.append('Notication_Form', thisInfo.Notication_Form);
      } else {
        document.getElementById('NotificationFormInvalid').style.border = '1px solid red';
        document.getElementById('MaternityEligibilityInvalid').style.border = '';
        document.getElementById('CreditFormInvalid').style.border = '';
        document.getElementById('MedicalReportInvalid').style.border = '';
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

      if (thisInfo.Maternity_Eligibility && isValidFileType(thisInfo.Maternity_Eligibility)) {
        document.getElementById('NotificationFormInvalid').style.border = '';
        document.getElementById('MaternityEligibilityInvalid').style.border = '';
        document.getElementById('CreditFormInvalid').style.border = '';
        document.getElementById('MedicalReportInvalid').style.border = '';
        formData.append('Maternity_Eligibility', thisInfo.Maternity_Eligibility);
      } else {
        document.getElementById('NotificationFormInvalid').style.border = '';
        document.getElementById('MaternityEligibilityInvalid').style.border = '1px solid red';
        document.getElementById('CreditFormInvalid').style.border = '';
        document.getElementById('MedicalReportInvalid').style.border = '';
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
      
      if (thisInfo.Credit_Form && isValidFileType(thisInfo.Credit_Form)) {
        document.getElementById('NotificationFormInvalid').style.border = '';
        document.getElementById('MaternityEligibilityInvalid').style.border = '';
        document.getElementById('CreditFormInvalid').style.border = '';
        document.getElementById('MedicalReportInvalid').style.border = '';
        formData.append('Credit_Form', thisInfo.Credit_Form);
      } else {
        document.getElementById('NotificationFormInvalid').style.border = '';
        document.getElementById('MaternityEligibilityInvalid').style.border = '';
        document.getElementById('CreditFormInvalid').style.border = '1px solid red';
        document.getElementById('MedicalReportInvalid').style.border = '';
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

      if (thisInfo.Medical_Reports && isValidFileType(thisInfo.Medical_Reports)) {
        document.getElementById('NotificationFormInvalid').style.border = '';
        document.getElementById('MaternityEligibilityInvalid').style.border = '';
        document.getElementById('CreditFormInvalid').style.border = '';
        document.getElementById('MedicalReportInvalid').style.border = '';
        formData.append('Medical_Reports', thisInfo.Medical_Reports);
      } else {
        document.getElementById('NotificationFormInvalid').style.border = '';
        document.getElementById('MaternityEligibilityInvalid').style.border = '';
        document.getElementById('CreditFormInvalid').style.border = '';
        document.getElementById('MedicalReportInvalid').style.border = '1px solid red';
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


      formData.append('currentEmployeeId', EmployeeId);    
      try {
        const response = await fetch('/MaternityNotification', {
          method: 'POST',
          body: formData,
        });
    
        if (response.ok) {
          const jsonResponse = await response.json();
    
          console.log(jsonResponse.message);
    
          setThisInfo({
            Notication_Form: '',
            Maternity_Eligibility: '',
            Credit_Form: '',
            Medical_Reports: ''
          });
    
          // Clear file input fields
          document.getElementById('Notication_Form').value = null;
          document.getElementById('Maternity_Eligibility').value = null;
          document.getElementById('Credit_Form').value = null;
          document.getElementById('Medical_Reports').value = null;
    
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
    
        }  else {
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
    
    const handleNotication_Form = (e) => {
      setThisInfo({ ...thisInfo, Notication_Form: e.target.files[0] });
    };
    const handMaternity_Eligibility = (e) => {
      setThisInfo({ ...thisInfo, Maternity_Eligibility: e.target.files[0] });
    };
    const handleCredit_Form = (e) => {
      setThisInfo({ ...thisInfo, Credit_Form: e.target.files[0] });
    };
    const handleMedical_Reports = (e) => {
      setThisInfo({ ...thisInfo, Medical_Reports: e.target.files[0] });
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
              
              setThisMNF({
                thisLabel: url[2].LinkName,
                thisLink: url[2].LinkURL
              });
              setThisME({
                thisLabel: url[3].LinkName,
                thisLink: url[3].LinkURL
              });
              setThisAMLC({
                thisLabel: url[4].LinkName,
                thisLink: url[4].LinkURL
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
            TransactionType: 'Maternity Notification',
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
                      <h4 className="m-0 font-weight-bold text-primary header-name">Maternity Notification</h4>
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
                              <h6 className="m-0 font-weight-bold text-primary">SSS Maternity Notification Form</h6>
                            </div>
                            {/* Card Body - New Hire Options */}
                            <div className="card-body" id='NotificationFormInvalid'>
                              <div className="tab-content">
                                <div className="card-body" >
                                  <div className="d-flex justify-content-left">
                                    <input id='Notication_Form' type="file" className="input-file" aria-describedby="fileHelp" onChange={handleNotication_Form}/>
                                    <small id="fileHelp" className="form-text text-muted">Choose a file to upload.</small>
                                  </div>
                                  <button style={{ fontSize: '12px', border: 'none', background: 'none' }} type="button">
                                    <a href={MNF.thisLink} target="_blank" rel="noopener noreferrer">Link to download SSS Maternity Form</a>
                                  </button>
                                  {Role !== 'Employee' && (
                                    <button
                                      style={{ fontSize: '12px', border: '1px solid #ccc', padding: '1px 5px', cursor: 'pointer', marginLeft: '3px' }}
                                      type="button"
                                      value="showMaternityForm"
                                      onClick={handleUpdateLinks}
                                    >
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
                              <h6 className="m-0 font-weight-bold text-primary">Screenshot of SSS Maternity Eligibility</h6>
                            </div>
                            {/* Card Body - New Hire Options */}
                            <div className="card-body" id='MaternityEligibilityInvalid'>
                              <div className="tab-content">
                                <div className="card-body">
                                  <div className="d-flex justify-content-left">
                                    <input id='Maternity_Eligibility' type="file" className="input-file" aria-describedby="fileHelp" onChange={handMaternity_Eligibility}/>
                                    <small id="fileHelp" className="form-text text-muted">Choose a file to upload.</small>
                                  </div>
                                  <button style={{ fontSize: '12px', border: 'none', background: 'none' }} type="button">
                                    <a href={ME.thisLink} target="_blank" rel="noopener noreferrer">Please see link for the steps/process</a>
                                  </button>
                                  {Role !== 'Employee' && (
                                    <button style={{ fontSize: '12px', border: '1px solid #ccc', padding: '1px 5px', cursor: 'pointer', marginLeft: '3px' }} type="button" value="showMaternityEligibility" onClick={handleUpdateLinks}>
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
                              <h6 className="m-0 font-weight-bold text-primary">SSS Allocation of Maternity Leave Credit Form</h6>
                            </div>
                            {/* Card Body - New Hire Options */}
                            <div className="card-body" id='CreditFormInvalid'>
                              <div className="tab-content">
                                <div className="card-body">
                                  <div className="d-flex justify-content-left">
                                    <input id='Credit_Form' type="file" className="input-file" aria-describedby="fileHelp" onChange={handleCredit_Form}/>
                                    <small id="fileHelp" className="form-text text-muted">Choose a file to upload.</small>
                                  </div>
                                  <button style={{ fontSize: '12px', border: 'none', background: 'none' }} type="button">
                                    <a href={AMLC.thisLink} target="_blank" rel="noopener noreferrer">Please see link for the steps/process</a>
                                  </button>
                                  {Role !== 'Employee' && (
                                    <button style={{ fontSize: '12px', border: '1px solid #ccc', padding: '1px 5px', cursor: 'pointer', marginLeft: '3px' }} type="button" value="showAllocationOfMaternityLeaveCredit" onClick={handleUpdateLinks}>
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
                              <h6 className="m-0 font-weight-bold text-primary">Medical Certificate or Ultrasound Report</h6>
                            </div>
                            {/* Card Body - New Hire Options */}
                            <div className="card-body" id='MedicalReportInvalid'>
                              <div className="tab-content">
                                <div className="card-body">
                                  <div className="d-flex justify-content-left">
                                    <input id='Medical_Reports' type="file" className="input-file" aria-describedby="fileHelp" onChange={handleMedical_Reports}/>
                                    <small id="fileHelp" className="form-text text-muted">Choose a file to upload.</small>
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
                {SelectedLink.thisSelectedLink === "showMaternityForm" ? (
                  <form onSubmit={handleLink}>
                    {/* Page content begins here */}
                          <div className="container-fluid">
                            <div className="row justify-content-center">
                                <div className="col-xl-12 col-lg-8">
                                    {/* First Card */}
                                    <div className="card shadow mb-4">
                                        {/* Card Header */}
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 text-primary">SSS Maternity Form</h6>
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
                                                    onChange={selectedMNF}
                                                    placeholder={MNF.thisLink}
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
                ) : SelectedLink.thisSelectedLink === "showMaternityEligibility" ? (
                  <form onSubmit={handleLink}>
                    {/* Page content begins here */}
                          <div className="container-fluid">
                            <div className="row justify-content-center">
                                <div className="col-xl-12 col-lg-8">
                                    {/* First Card */}
                                    <div className="card shadow mb-4">
                                        {/* Card Header */}
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 text-primary"> SSS Maternity Eligibility</h6>
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
                                                    onChange={selectedME}
                                                    placeholder={ME.thisLink}
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
                ) : SelectedLink.thisSelectedLink === "showAllocationOfMaternityLeaveCredit" ? (
                  <form onSubmit={handleLink}>
                    {/* Page content begins here */}
                          <div className="container-fluid">
                            <div className="row justify-content-center">
                                <div className="col-xl-12 col-lg-8">
                                    {/* First Card */}
                                    <div className="card shadow mb-4">
                                        {/* Card Header */}
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 text-primary"> SSS Allocation of Maternity Leave Credit Form</h6>
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
                                                    onChange={selectedAMLC}
                                                    placeholder={AMLC.thisLink}
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

export default MaternityNotification;