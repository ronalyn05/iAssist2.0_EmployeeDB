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

function SicknessNotification() {

    const EmployeeId = sessionStorage.getItem("employeeId");
    const Role = sessionStorage.getItem("role");

    const [thisInfo, setThisInfo] = useState({
        SicknessNotificationForm: "",
        PlaceOfConfinement: "",
        MedicalCertificate: "",
        SupportingDocuments: "",
        ECSupportingDocuments: ""
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

    const [SN, setThisSN] = useState({
      thisLabel: '',
      thisLink: ''
    });


    const selectedSN = (e) => {
      e.preventDefault();
      setcurrentValue(prevState => ({
        ...prevState,
        currentLabel: "SSS SN",
        currentLink: e.target.value
      }));
    };

    useEffect(() => {
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

        if (thisInfo.SicknessNotificationForm && isValidFileType(thisInfo.SicknessNotificationForm)) {
            formData.append("SicknessNotificationForm", thisInfo.SicknessNotificationForm);

            document.getElementById('FormInvalid').style.border = '';
            document.getElementById('ConfinementInvalid').style.border = '';
            document.getElementById('CertificateInvalid').style.border = '';
            document.getElementById('SupportingInvalid').style.border = '';
            document.getElementById('ECSupportingInvalid').style.border = '';

        } else {
            document.getElementById('FormInvalid').style.border = '1px solid red';
            document.getElementById('ConfinementInvalid').style.border = '';
            document.getElementById('CertificateInvalid').style.border = '';
            document.getElementById('SupportingInvalid').style.border = '';
            document.getElementById('ECSupportingInvalid').style.border = '';
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

        let POCvalue = "";
        if(thisInfo.PlaceOfConfinement !== ""){
            if(thisInfo.PlaceOfConfinement === '1'){
                document.getElementById('FormInvalid').style.border = '';
                document.getElementById('ConfinementInvalid').style.border = '';
                document.getElementById('CertificateInvalid').style.border = '';
                document.getElementById('SupportingInvalid').style.border = '';
                document.getElementById('ECSupportingInvalid').style.border = '';
                POCvalue = "Home Confinement";
            }else{
                document.getElementById('FormInvalid').style.border = '';
                document.getElementById('ConfinementInvalid').style.border = '';
                document.getElementById('CertificateInvalid').style.border = '';
                document.getElementById('SupportingInvalid').style.border = '';
                document.getElementById('ECSupportingInvalid').style.border = '';
                POCvalue = "Hospital Confinement";
            }
        }else{
            document.getElementById('FormInvalid').style.border = '';
            document.getElementById('ConfinementInvalid').style.border = '1px solid red';
            document.getElementById('CertificateInvalid').style.border = '';
            document.getElementById('SupportingInvalid').style.border = '';
            document.getElementById('ECSupportingInvalid').style.border = '';
            return;
        }
        
        

        if (thisInfo.MedicalCertificate && isValidFileType(thisInfo.MedicalCertificate)) {
            formData.append("MedicalCertificate", thisInfo.MedicalCertificate);

            document.getElementById('FormInvalid').style.border = '';
            document.getElementById('ConfinementInvalid').style.border = '';
            document.getElementById('CertificateInvalid').style.border = '';
            document.getElementById('SupportingInvalid').style.border = '';
            document.getElementById('ECSupportingInvalid').style.border = '';
        } else {
            document.getElementById('FormInvalid').style.border = '';
            document.getElementById('ConfinementInvalid').style.border = '';
            document.getElementById('CertificateInvalid').style.border = '1px solid red';
            document.getElementById('SupportingInvalid').style.border = '';
            document.getElementById('ECSupportingInvalid').style.border = '';
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

        if (thisInfo.SupportingDocuments && isValidFileType(thisInfo.SupportingDocuments)) {
            formData.append("SupportingDocuments", thisInfo.SupportingDocuments);
            document.getElementById('FormInvalid').style.border = '';
            document.getElementById('ConfinementInvalid').style.border = '';
            document.getElementById('CertificateInvalid').style.border = '';
            document.getElementById('SupportingInvalid').style.border = '';
            document.getElementById('ECSupportingInvalid').style.border = '';
        } else {
            document.getElementById('FormInvalid').style.border = '';
            document.getElementById('ConfinementInvalid').style.border = '';
            document.getElementById('CertificateInvalid').style.border = '';
            document.getElementById('SupportingInvalid').style.border = '1px solid red';
            document.getElementById('ECSupportingInvalid').style.border = '';
            toast.error('Invalid StatementOfAccount file type. Please upload a PDF, PNG, or JPEG file.', {
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
        if (thisInfo.ECSupportingDocuments && isValidFileType(thisInfo.ECSupportingDocuments)) {
            formData.append("ECSupportingDocuments", thisInfo.ECSupportingDocuments);
            document.getElementById('FormInvalid').style.border = '';
            document.getElementById('ConfinementInvalid').style.border = '';
            document.getElementById('CertificateInvalid').style.border = '';
            document.getElementById('SupportingInvalid').style.border = '';
            document.getElementById('ECSupportingInvalid').style.border = '';
        } else {
            document.getElementById('FormInvalid').style.border = '';
            document.getElementById('ConfinementInvalid').style.border = '';
            document.getElementById('CertificateInvalid').style.border = '';
            document.getElementById('SupportingInvalid').style.border = '';
            document.getElementById('ECSupportingInvalid').style.border = '1px solid red';
            toast.error('Invalid StatementOfAccount file type. Please upload a PDF, PNG, or JPEG file.', {
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
            formData.append("PlaceOfConfinement", POCvalue);

            const response = await fetch('/SicknessNotification', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                const jsonResponse = await response.json();
                console.log(jsonResponse.message);
    
                setThisInfo({
                    SicknessNotificationForm: '',
                    PlaceOfConfinement: '',
                    MedicalCertificate: '',
                    SupportingDocuments: '',
                    ECSupportingDocuments: ''
                });
    
                // Clear file input fields
                document.getElementById('SicknessNotificationForm').value = null;
                document.getElementById('PlaceOfConfinement').checked = null;
                document.getElementById('MedicalCertificate').value = null;
                document.getElementById('SupportingDocuments').value = null;
                document.getElementById('ECSupportingDocuments').value = null;
                
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
    
    const handleSicknessNotificationForm = (e) => {
        setThisInfo({ ...thisInfo, SicknessNotificationForm: e.target.files[0] });
    };
    const handlePlaceOfConfinement = (e) => {
        setThisInfo({ ...thisInfo, PlaceOfConfinement: e.target.value });
    };
    const handleMedicalCertificate = (e) => {
        setThisInfo({ ...thisInfo, MedicalCertificate: e.target.files[0] });
    };
    const handleSupportingDocuments = (e) => {
        setThisInfo({ ...thisInfo, SupportingDocuments: e.target.files[0] });
    };
    const handleECSupportingDocuments = (e) => {
        setThisInfo({ ...thisInfo, ECSupportingDocuments: e.target.files[0] });
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
                
                setThisSN({
                  thisLabel: url[6].LinkName,
                  thisLink: url[6].LinkURL
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
              TransactionType: 'SSS Sickness Notification',
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
                            <h4 className="m-0 font-weight-bold text-primary header-name">SSS Sickness Notication</h4>
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
                                            <h6 className="m-0 font-weight-bold text-primary">SSS Sickness Notification Form (Non-anonymous question) *</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body" id='FormInvalid'>
                                            <div className="">
                                                <div className="">
                                                    <div className="">
                                                        <label> Upload completely filled-out SSS Sickness Notification Form or Medical Certificate with Diagnosis and indicated number of days or period covered for the SSS Sickness application. </label>
                                                    </div>
                                                    <br/>
                                                    <input id='SicknessNotificationForm' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleSicknessNotificationForm} />
                                                    <button style={{ fontSize: '12px', border: 'none', background: 'none' }} type="button">
                                                        Link to download Form: <a href={SN.thisLink} target="_blank" rel="noopener noreferrer">SSS Notification Form</a>
                                                    </button>
                                                    {Role !== 'Employee' && (
                                                        <button style={{ fontSize: '12px', border: '1px solid #ccc', padding: '1px 5px', cursor: 'pointer', marginLeft: '3px' }} type="button" value="showSicknessNotification" onClick={handleUpdateLinks}>
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
                                            <h6 className="m-0 font-weight-bold text-primary">Place of Confinement *</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body" id='ConfinementInvalid'>
                                            <div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="PlaceOfConfinement"  
                                                        id="PlaceOfConfinement"
                                                        value="1"
                                                        checked={thisInfo.PlaceOfConfinement === '1'}  // Compare with '1'
                                                        onChange={handlePlaceOfConfinement}
                                                    />
                                                    <label className="form-check-label" htmlFor="homeConfinement">
                                                        Home Confinement (Notification on the first day of confinement)
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="PlaceOfConfinement"  
                                                        id="PlaceOfConfinement"
                                                        value="2"
                                                        checked={thisInfo.PlaceOfConfinement === '2'}  // Compare with '2'
                                                        onChange={handlePlaceOfConfinement}
                                                    />
                                                    <label className="form-check-label" htmlFor="hospitalConfinement">
                                                        Hospital Confinement (Notification after discharge)
                                                    </label>
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
                                            <h6 className="m-0 font-weight-bold text-primary">Medical Certificate (Non-anonymous question) *</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body" id='CertificateInvalid'>
                                            <div className="">
                                                    <div className="">
                                                        <label>
                                                            SS Medical Certificate (MMD 102) Form or attending physician's personal Medical Certificate with the following information:
                                                            <br/>
                                                            Name of attending Physician
                                                            <br/>
                                                            -PRC Number (Not required if Physician is practicing abroad) <br/>
                                                            -Clinic Address, and/or <br/>
                                                            -Contact information (such as but not limited to landline/mobile number) <br/>
                                                            -Diagnosis <br/>
                                                            -Recommended number of days of convalescence including recuperation  <br/>
                                                        </label>
                                                    </div>
                                                    <br/>
                                                    <input id='MedicalCertificate' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleMedicalCertificate} />
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
                                            <h6 className="m-0 font-weight-bold text-primary">Supporting Documents (Non-anonymous question)</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body" id='SupportingInvalid'>
                                            <div className="">
                                                    <div className="">
                                                        <label>
                                                            Other Medical Documents
                                                            <br/>
                                                            A certified true copy of ANY 1 of the following, whichever is applicable: <br/>
                                                            -Hospital Abstract <br/>
                                                            -Discharge Summary <br/>
                                                            -Record of Operation <br/>
                                                            -Histopathology Report <br/>
                                                            -Chest X-Ray Result <br/>
                                                            -X-ray result of the affected part (For Fracture) <br/>
                                                            -ECG/2D Echo Result <br/>
                                                            -MRI/CT Scan Result <br/>
                                                            -Laboratory Result <br/>
                                                        </label>
                                                    </div>
                                                    <br/>
                                                    <input id='SupportingDocuments' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleSupportingDocuments} />
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
                                            <h6 className="m-0 font-weight-bold text-primary">EC Supporting Documents (Non-anonymous question)</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body" id='ECSupportingInvalid'>
                                            <div className="">
                                                    <div className="">
                                                        <label>
                                                        -Accident/Sickness Report (Form B-309) <br/>
                                                        -EC Logbook <br/>
                                                        -Job Description <br/>
                                                        -Police Report (if applicable) <br/>
                                                        Certificate from Employer indicating the following: <br/>
                                                        &nbsp;&nbsp;-Last day of work before the COVID infection <br/>
                                                        &nbsp;&nbsp;-Inclusive dates of leave of absence or quarantine leave <br/>
                                                        </label>
                                                    </div>
                                                    <br/>
                                                    <input id='ECSupportingDocuments' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleECSupportingDocuments} />
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
                {SelectedLink.thisSelectedLink === "showSicknessNotification" ? (
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
                                                    onChange={selectedSN}
                                                    placeholder={SN.thisLink}
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

export default SicknessNotification;