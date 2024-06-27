import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../navbar';
import TopNavbar from '../topnavbar';
import Footer from '../footer';
import '../../App.css';
import { sendEmail } from '../globalFunctions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

 function PagibigRequest() {

    const EmployeeId = sessionStorage.getItem("employeeId");
    
    const [selected, setSelected] = useState("0");
    const [ErroneousName, setErroneousName] = useState("");
    const [CorrectName, setCorrectName] = useState("");
    const [thisInfo, setThisInfo] = useState({
      StatementOfAccount: '',
      FormFromPagIbig: '',
      erName: '',
      coName: '',
      deliveryType: ''
    });

    // useEffect(() => {
    //   [EmployeeId];
    // });
  
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
      formData.append("selected", selected); // Assuming selected is define
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

      // Append other files based on selected option
      if(selected === '1'){
        if (thisInfo.StatementOfAccount && isValidFileType(thisInfo.StatementOfAccount)) {
          formData.append('StatementOfAccount', thisInfo.StatementOfAccount);
          document.getElementById('StatementOfAccount').style.border = '';
        } else {
            document.getElementById('StatementOfAccount').style.border = '1px solid red';
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

      } 
      else if(selected === '2') {

        if (thisInfo.FormFromPagIbig && isValidFileType(thisInfo.FormFromPagIbig)) {
            formData.append('FormFromPagIbig', thisInfo.FormFromPagIbig);
            formData.append('ErroneousName', ErroneousName);
            formData.append('CorrectName', CorrectName);
           
        } else {
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
        const response = await fetch('/PagIbigRequest', {
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
          
            setThisInfo({
              StatementOfAccount:'',
              erName: '',
              coName: '',
              deliveryType: ''
            });
            setSelected("0");
            setErroneousName("");
            setCorrectName("");
            
            // Clear file input fields
            document.getElementById('StatementOfAccount').value = null;
            document.getElementById('deliveryType').value = null;
            document.getElementById('erName').value = null;
            document.getElementById('coName').value = null;
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
          console.error('Error uploading', error);
      }
    };
    const handleStatementOFAccount = (e) => {
      setThisInfo({ ...thisInfo, StatementOfAccount: e.target.files[0] });
    };
    const handleFormFromPagIbig = (e) => {
      setThisInfo({ ...thisInfo, FormFromPagIbig: e.target.files[0] });
    };
    
    const handleErroneousName = (event) => {
      setErroneousName(event.target.value);
    };
    const handleCorrectName = (event) => {
      setCorrectName(event.target.value);
    };
    

  const SendEmailNotification= () => {
        
    const content = {
        HrName: '',
        HrEmail: '', // hr's email
        Name: sessionStorage.getItem("firstName") + " " + sessionStorage.getItem("lastName"),
        EmailAddress: sessionStorage.getItem("email"), // employee's email
        TransactionType: 'Certification Request: PAG-IBIG',
        documentName: '',
        reason: '',
        stopDeduction: false,
        facility: sessionStorage.getItem("facility")
    };

    console.log(content); 
    
    sendEmail('submit',content)
  };

  
    if (!thisInfo) {
      return <div>Loading...</div>;
    }
    return (
      <div id="wrapper">
          <Navbar />
          <div id="content-wrapper" className="d-flex flex-column">
              <div id="content">
                <TopNavbar />
                <div className="container-fluid">
                    <div className="row justify-content-center">
                      <h4 className="m-0 font-weight-bold text-primary header-name">Certificate Request ( PAG-IBIG )</h4>
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
                                        <label htmlFor="deliveryType">PAG-IBIG Request for: </label>
                                        <select className="form-control" id="deliveryType" name="deliveryType" value={thisInfo.deliveryType} onChange={handleInputChange}>
                                          <option value="0" >Select Type</option>
                                          <option value="1">Certificate of Remittance</option>
                                          <option value="2">Certificate of Oneness</option>
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
                                        { selected === "1" && selected  !== "0" && (
                                        <div className="row justify-content-left content-holder">
                                          <div className="form-group">
                                            <label htmlFor="middleName">Certificate of Remittance</label>  
                                          </div>
                                          <div className="form-group">
                                            <label style={{ fontSize: '14px' }}>Upload Latest Statement of Account (Non-anonymous question) *</label>
                                            <input id='StatementOfAccount' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleStatementOFAccount}/>
                                          </div>
                                        </div> 
                                        )}
                                         
                                         { selected === '2' && selected !== '0' && selected !== '1'&& (
                                        <div className="row justify-content-left content-holder">
                                          <div className="form-group">
                                            <label htmlFor="middleName">Certificate of Oneness</label> 
                                          </div>
                                          <div className="form-group">
                                            <label style={{ fontSize: '14px' }}>Upload Printout Form From Pag-Ibig (Non-anonymous question) *</label> 
                                            <input id='' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleFormFromPagIbig}/>
                                          </div>
                                          <div style={{ border: '1px solid #ccc', marginTop: '5px', marginBottom: '5px' }} />
                                          <div className="form-group">
                                            <label htmlFor="middleName">ERRONEOUS NAME *</label> 
                                            
                                            <textarea
                                                            type="text"
                                                            className="form-control text-black-100"
                                                            style={{ height: '40px' }}
                                                            id="erName"
                                                            value={ErroneousName}
                                                            onChange={handleErroneousName}
                                                            placeholder="Type here..."
                                                        />
                                          </div>

                                          <div style={{ border: '1px solid #ccc', marginTop: '5px', marginBottom: '5px' }} />
                                          <div className="form-group">
                                            <label htmlFor="middleName">CORRECT NAME *</label> 
                                            <textarea
                                                            type="text"
                                                            className="form-control text-black-700"
                                                            style={{ height: '40px' }}
                                                            id="coName"
                                                            value={CorrectName}
                                                            onChange={handleCorrectName}
                                                            placeholder="Type here..."
                                                        />
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
      </div>
  );
}

export default PagibigRequest;