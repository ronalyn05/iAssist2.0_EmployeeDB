import React, { useState, useEffect } from 'react';
import Navbar from '../navbar';
import TopNavbar from '../topnavbar';
import Footer from '../footer';
import '../../App.css';
import { sendEmail } from '../globalFunctions';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

 function PagIbigVirtualAccount() {
   
    const EmployeeId = sessionStorage.getItem("employeeId");

    const [thisInfo, setThisInfo] = useState({
      Screenshot_VirtualAcc: '',
      paySlipFiles: '',
      GrossIncome: ''
    });
  
    // useEffect(() => {
    //   [EmployeeId]
    // });

    const handleFormSubmit = async (e) => {
      e.preventDefault();
  
      const isValidFileType = (file) => {
          const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
          return allowedTypes.includes(file.type);
      };
  
      const formData = new FormData();
      formData.append('currentEmployeeId', EmployeeId);
      
  
      // Validate and append Screenshot Virtual
      if (thisInfo.Screenshot_VirtualAcc && isValidFileType(thisInfo.Screenshot_VirtualAcc)) {
          formData.append('Screenshot_Virtual', thisInfo.Screenshot_VirtualAcc);

          document.getElementById('ScreenshotVirtualInvalid').style.border = '';
          document.getElementById('PayslipInvalid').style.border = '';
          document.getElementById('GrossIncomeInvalid').style.border = '';
      } else {
        document.getElementById('ScreenshotVirtualInvalid').style.border = '1px solid red';
        document.getElementById('PayslipInvalid').style.border = '';
        document.getElementById('GrossIncomeInvalid').style.border = '';
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
  
      // Validate and append Pay Slip
      if (thisInfo.paySlip && isValidFileType(thisInfo.paySlip)) {
          formData.append('paySlip', thisInfo.paySlip);

          document.getElementById('ScreenshotVirtualInvalid').style.border = '';
          document.getElementById('PayslipInvalid').style.border = '';
          document.getElementById('GrossIncomeInvalid').style.border = '';
      } else {
        document.getElementById('ScreenshotVirtualInvalid').style.border = '';
        document.getElementById('PayslipInvalid').style.border = '1px solid red';
        document.getElementById('GrossIncomeInvalid').style.border = '';
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

      // Validate and append GrossIncome
      if (thisInfo.GrossIncome && isValidFileType(thisInfo.GrossIncome)) {
          formData.append('GrossIncome', thisInfo.GrossIncome);
          
          document.getElementById('ScreenshotVirtualInvalid').style.border = '';
          document.getElementById('PayslipInvalid').style.border = '';
          document.getElementById('GrossIncomeInvalid').style.border = '';

      } else {
        document.getElementById('ScreenshotVirtualInvalid').style.border = '';
        document.getElementById('PayslipInvalid').style.border = '';
        document.getElementById('GrossIncomeInvalid').style.border = '1px solid red';
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
          const response = await fetch('/PagIbigVirtualAccount', {
              method: 'POST',
              body: formData,
          });
  
          if (response.ok) {
              const jsonResponse = await response.json();
  
              console.log(jsonResponse.message);
  
              setThisInfo({
                  Screenshot_VirtualAcc: '',
                  paySlipFiles: '',
                  GrossIncome: ''
              });
  
              // Clear file input fields
              document.getElementById('Screenshot_VirtualAcc').value = null;
              document.getElementById('paySlipFiles').value = null;
              document.getElementById('GrossIncome').value = null;
  
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
  

    const handleScreenshot_Virtual = (e) => {
      setThisInfo({ ...thisInfo, Screenshot_VirtualAcc: e.target.files[0] });
    };
    const handlePay_Slip = (e) => {
      setThisInfo({ ...thisInfo, paySlip: e.target.files[0] });
    };
    const handleGrossIncome = (e) => {
      setThisInfo({ ...thisInfo, GrossIncome: e.target.files[0] });
    };

    const SendEmailNotification= () => {
          
      const content = {
          HrName: '',
          HrEmail: '', // hr's email
          Name: sessionStorage.getItem("firstName") + " " + sessionStorage.getItem("lastName"),
          EmailAddress: sessionStorage.getItem("email"), // employee's email
          TransactionType: 'Pag-Ibig Virtual Account',
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
                      <h4 className="m-0 font-weight-bold text-primary header-name">Pag-Ibig Virtual Account</h4>
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
                              <h6 className="m-0 font-weight-bold text-primary">Screenshot of Filed Loan via Virtual Account</h6>
                            </div>
                            {/* Card Body - New Hire Options */}
                            <div className="card-body" id='ScreenshotVirtualInvalid'>
                              <div className="tab-content">
                                <div className="card-body">
                                  <div className="d-flex justify-content-left">
                                    <input id='Screenshot_VirtualAcc' type="file" className="input-file" aria-describedby="fileHelp" onChange={handleScreenshot_Virtual}/>
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
                                    <input id="paySlipFiles" type="file" className="input-file" aria-describedby="fileHelp" onChange={handlePay_Slip}/>
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
                              <h6 className="m-0 font-weight-bold text-primary">1 Month Gross Income</h6>
                            </div>
                            {/* Card Body - New Hire Options */}
                            <div className="card-body" id='GrossIncomeInvalid'>
                              <div className="tab-content">
                                <div className="card-body">
                                  <div className="d-flex justify-content-left">
                                    <input id="GrossIncome" type="file" className="input-file" aria-describedby="fileHelp" onChange={handleGrossIncome}/>
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

export default PagIbigVirtualAccount;