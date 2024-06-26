import React, { useState, useEffect } from 'react';
import Navbar from '../navbar';
import TopNavbar from '../topnavbar';
import Footer from '../footer';
import '../../App.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendEmail } from '../globalFunctions';

function PagIbigLandbankCard() {

  const EmployeeId = sessionStorage.getItem("employeeId");

  const [thisInfo, setThisInfo] = useState({
    Application_Form: '',
    paySlipFiles: '',
    Valid_ID: ''
  });

  // useEffect(() => {
  //   [EmployeeId]
  // });

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const isValidFileType = (file) => {
        const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
        return file && allowedTypes.includes(file.type);
    };

    const formData = new FormData();
    formData.append('currentEmployeeId', EmployeeId);

    // Validate and append Application Form
    if (isValidFileType(thisInfo.Application_Form)) {
        formData.append('Application_Form', thisInfo.Application_Form);

        document.getElementById('appFormInvalid').style.border = '';
        document.getElementById('PayslipInvalid').style.border = '';
        document.getElementById('IdInvalid').style.border = '';
    } else {
      document.getElementById('appFormInvalid').style.border = '1px solid red';
      document.getElementById('PayslipInvalid').style.border = '';
      document.getElementById('IdInvalid').style.border = '';
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

    // Validate and append Pay Slip Files
    if (isValidFileType(thisInfo.paySlipFiles)) {
        formData.append('paySlipFiles', thisInfo.paySlipFiles);

        document.getElementById('appFormInvalid').style.border = '';
        document.getElementById('PayslipInvalid').style.border = '';
        document.getElementById('IdInvalid').style.border = '';
    } else {
        document.getElementById('appFormInvalid').style.border = '';
        document.getElementById('PayslipInvalid').style.border = '1px solid red';
        document.getElementById('IdInvalid').style.border = '';
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

    // Validate and append Valid ID
    if (isValidFileType(thisInfo.Valid_ID)) {
        formData.append('Valid_ID', thisInfo.Valid_ID);

        document.getElementById('appFormInvalid').style.border = '';
        document.getElementById('PayslipInvalid').style.border = '';
        document.getElementById('IdInvalid').style.border = '';
    } else {
      document.getElementById('appFormInvalid').style.border = '';
      document.getElementById('PayslipInvalid').style.border = '';
      document.getElementById('IdInvalid').style.border = '1px solid red';
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

    try {
        const response = await fetch('/PagIbigLandbankCard', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const jsonResponse = await response.json();

            console.log(jsonResponse.message);

            setThisInfo({
                Application_Form: '',
                paySlipFiles: '',
                Valid_ID: ''
            });

            // Clear file input fields
            document.getElementById('applicationFormInput').value = null;
            document.getElementById('paySlipInput').value = null;
            document.getElementById('validIdInput').value = null;

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

  const handleApplication_Form = (e) => {
    setThisInfo({ ...thisInfo, Application_Form: e.target.files[0] });
  };
  const handlepay_Slip = (e) => {
    setThisInfo({ ...thisInfo, paySlipFiles: e.target.files[0] });
  };
  const handleValid_ID = (e) => {
    setThisInfo({ ...thisInfo, Valid_ID: e.target.files[0] });
  };

  const SendEmailNotification= () => {
        
    const content = {
        HrName: '',
        HrEmail: '', // hr's email
        Name: sessionStorage.getItem("firstName") + " " + sessionStorage.getItem("lastName"),
        EmailAddress: sessionStorage.getItem("email"), // employee's email
        TransactionType: 'Pag-Ibig Landbank Card',
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
              <h4 className="m-0 font-weight-bold text-primary header-name">Pag-Ibig Landbank Card</h4>
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
                      <h6 className="m-0 font-weight-bold text-primary">Application Form</h6>
                    </div>
                    {/* Card Body - New Hire Options */}
                    <div className="card-body" id='appFormInvalid'>
                      <div className="tab-content">
                        <div className="card-body">
                          <div className="d-flex justify-content-left">
                            <input id="applicationFormInput" type="file" className="input-file" aria-describedby="fileHelp" onChange={handleApplication_Form} />
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

            {/* page content begin here */}
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div className="col-xl-8 col-lg-7">
                  <div className="card shadow mb-4">
                    {/* Card Header - New Hire Upload */}
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h6 className="m-0 font-weight-bold text-primary">1 Month Payslip</h6>
                    </div>
                    {/* Card Body - New Hire Options */}
                    <div className="card-body" id='PayslipInvalid'>
                      <div className="tab-content">
                        <div className="card-body">
                          <div className="d-flex justify-content-left">
                            <input id="paySlipInput" type="file" className="input-file" aria-describedby="fileHelp" onChange={handlepay_Slip} />
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

            {/* page content begin here */}
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div className="col-xl-8 col-lg-7">
                  <div className="card shadow mb-4">
                    {/* Card Header - New Hire Upload */}
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h6 className="m-0 font-weight-bold text-primary">One(1) Valid ID, Innodata Company ID, Cash Card, & Selfie Photo</h6>
                    </div>
                    {/* Card Body - New Hire Options */}
                    <div className="card-body" id='IdInvalid'>
                      <div className="tab-content">
                        <div className="card-body">
                          <div className="d-flex justify-content-left">
                            <input id="validIdInput" type="file" className="input-file" aria-describedby="fileHelp" onChange={handleValid_ID} />
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
    </div>
  );
}

export default PagIbigLandbankCard;