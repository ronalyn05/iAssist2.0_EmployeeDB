import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../navbar';
import TopNavbar from '../topnavbar';
import Footer from '../footer';
import '../../App.css'; 
import { base64pdf } from '../../vblob';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'; 
import emailjs from '@emailjs/browser'; 
import "react-pdf/dist/esm/Page/TextLayer.css"; 
import { insertNotification, sendEmailjs } from '../globalFunctions'; 

import { Document, Page,pdfjs } from 'react-pdf'; 


 function RequestView() {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`; 

    const location = useLocation();
    const data = location.state.data;
 
    const HrEmail = sessionStorage.getItem("email");
    const HrEmpId = sessionStorage.getItem("employeeId");
    const HrName = sessionStorage.getItem("firstName") + " " + sessionStorage.getItem("lastName") ;
 
 
    const [showModal, setShowModal] = useState(false);
    const [numPages, setNumPages] = useState(); 
    const [pdfUrl, setPdfUrl] = useState(''); 
    const [imageUrl, setImageUrl] = useState('');


    const [pdf, setPdf] = useState([]); 
    
    // Converts base64 to pdf
    const convertToPDF = (base64) => {
      // const binaryString = atob(base64?base64:base64pdf.blobpdf2);
      const binaryString = atob(base64?base64:base64pdf.blobpdf2);

      const arrayBuffer = new ArrayBuffer(binaryString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      } 
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob))
      return(URL.createObjectURL(blob))
    } 

    const convertToImage = (base64,type) => {
      // Decode the base64 string to binary data
      const binaryString = atob(base64);
    
      // Create a buffer and a uint8 array from the binary string
      const arrayBuffer = new ArrayBuffer(binaryString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }
    
      // Create a blob from the uint8 array and specify the image type
      const blob = new Blob([arrayBuffer], { type: `image/${type}` });
    
      // Create a URL for the blob
      const imageUrl = URL.createObjectURL(blob);
      return imageUrl;
    };
    
    // Converts and download
    const convertAndDownloadPDF = (base64, fileName) => {   

      const url = convertToPDF(base64);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    };
  
    useEffect(() => {   
      getSubmissionPDF()  
    },[]); 

    // Get all pdf of a transaction
    const getSubmissionPDF = async () => { 

        const formData = new FormData();
        formData.append('SubmissionID', data.SubmissionID);
        
        try {
          const uploadResponse = await fetch('http://localhost:5000/submissionpdf', {
            method: 'POST',
            body: formData,
          });
       
          if (!uploadResponse.ok) {
            console.error('Failed to upload PDF:', uploadResponse.statusText);
            return;
          }

          try {
            const responseData = await uploadResponse.json();   
            if(responseData.result){
              const sortedData = responseData.result.sort((a, b) => {   
                if (a.RequirementName !== b.RequirementName) {
                  return a.RequirementName.localeCompare(b.RequirementName);
                } else { 
                  return b.Updated - a.Updated;
                }
              }); 
              setPdf(sortedData);
            }            
            
          } catch (error) {
              console.error('Error parsing JSON response:', error);
          }
       
        } catch (error) {
          console.error('Error uploading PDF:', error);
        }
    }; 
  

    const handleFormSubmit = async (e) => {
      e.preventDefault();   
      const reasonArray = [];
      const documentNameArray = []; 

      pdf.forEach(pdf => {
        if(pdf.Resubmit && pdf.ResubmitReason && !pdf.Updated){ 
          documentNameArray.push(pdf.RequirementName); 
          reasonArray.push(pdf.ResubmitReason);
          
          updatePdf(pdf)
        }
      }); 
 
      let documentName = documentNameArray.join(', '); 
      documentName = documentName.replace(/,([^,]*)$/, ' &$1'); 
      let reason = reasonArray.join(', '); 
      reason = reason.replace(/,([^,]*)$/, ' & $1');
      if(reasonArray.length > 1){ 
        reason += ' respectively'
      }    
      if(reasonArray.length !== 0 && documentNameArray.length !== 0) { 
        insertNotification(data.Name, data.TransactionType, HrEmpId, data.EmpId, 'resubmit', data.SubmissionID) 
        sendEmail('resubmit', reason, documentName) 
        getSubmissionPDF() 
      }

    }; 
     
 
    //update pdf for resubmission
    const updatePdf = async (pdfSubmit) => { 
      
      const formData = new FormData();
      formData.append('id', pdfSubmit.PdfFileID); 
      formData.append('reason', pdfSubmit.ResubmitReason); 
      formData.append('SubmissionID', data.SubmissionID); 
        
      try {
        const uploadResponse = await fetch('http://localhost:5000/updatepdf', {
          method: 'POST',
          body: formData
        }) 
    
        if (!uploadResponse.ok) {
          console.error('Failed:', uploadResponse.statusText);
          return;
        } 
      } catch (error) {
        console.error('Error:', error);
      }
    };

    //update submission to 'complete'
    const completeSubmission = async () => { 
      const formData = new FormData();
      formData.append('id', data.SubmissionID);  
        
      try {
        const uploadResponse = await fetch('http://localhost:5000/updatesubmission', {
          method: 'POST',
          body: formData
        }) 
    
        if (!uploadResponse.ok) {
          console.error('Failed:', uploadResponse.statusText);
          return;  
        }

        insertNotification(data.Name, data.TransactionType, HrEmpId, data.EmpId, 'complete', data.SubmissionID)
        
        try {
          const result = await sendEmail('complete');
          if (result) {
            window.history.back();
          }
        } catch (error) {
          console.error('Error sending email:', error); 
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };  
    
    
    // Modal functions
    const handleButtonClick = (data) => {
      if(data.ContentType=='.pdf'){  
        convertToPDF(data.PdfData);
        setImageUrl(''); 
      } else {  
        const url = convertToImage(data.PdfData,data.ContentType); 
        setImageUrl(url); 
        setPdfUrl(''); 
      }

      setShowModal(true);
    };
    const handleCloseModal = () => {
      setShowModal(false);
    };

    
    // Checkbox 
    const checkbox = (id, status) => { 
    
      const isChecked = status.target.checked;
      const index = pdf.findIndex(pdf => pdf.PdfFileID === id);
      if (index !== -1) {
        pdf[index].Resubmit = isChecked; 
        setPdf([...pdf]); 
      }
    };
    // Reason 
    const resubmitReason = (id, reason) => {  
      const reasonPDF = reason.target.value;
      const index = pdf.findIndex(pdf => pdf.PdfFileID === id);
      if (index !== -1) {
        pdf[index].ResubmitReason = reasonPDF; 
        setPdf([...pdf]); 
      }
    }; 


    // Function to handle form submission
    const sendEmail = async (type, reason, documentName) => {  
      const content = {
        sender_name: HrName,
        sender_email: HrEmail, // hr's email
        receiver_name: data.Name,
        receiver_email: data.EmailAddress, // employee's email
        transaction_type: data.TransactionType,
        document_name: documentName,
        reason: reason 
      };  
      try {
        const result = await sendEmailjs(type, content);
        if (result) {
          return Promise.resolve(true);
        } else {
          return Promise.reject(false);
        }
      } catch (error) {
        return Promise.reject(false);
      }
       
    };

    // Checkbox 
    const validate = () => { 
    
      if((data.LoanAppDate || data.TransactionNum || data.TypeOfDelivery || 
        data.CorrectName || data.DeductionFor || data.Description || 
        data.ErroneousName || data.OtherReq || data.ReasonType || 
        data.RequestTitle || data.RequestType || data.PlaceOfConfinement || 
        data.BankAccNumber || data.CompletionDate || data.DeductionFor || 
        data.ReasonForInfoUpdate || data.CurrentFullname || data.NewFullname || 
        data.CurrentCivilStatus || data.NewCivilStatus )){
        return true
      } else {
        return false
      } 
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
              <h4 className="m-0 font-weight-bold text-primary header-name">{data.TransactionType}</h4>
            </div>
          </div>
          <br/>
          <div className="row justify-content-center">
            <div className="col-xl-12 col-xl-9">
            {/* <form > */}
              <div className="card shadow mb-4 "> 
                  <br/>
                    <div className="tab-content">
                      <div className="tab-pane fade show active" id="personalDetails" role="tabpanel" aria-labelledby="personalDetails-tab">
                          {/* Personal Details Form */}
                      <div className="container">
                              <div className="justify-content-center">
                                <div > 
                                <div className="d-flex justify-content-between">
                                    <label>{data.Name}</label>
                                    <label>{data.DateTime}</label>
                                    <label>{data.TurnAround} Days</label>
                                    <label>{data.Status}</label>
                                    {(data.Status !== 'Complete' && data.Status !== 'Expired' && data.Status !== 'Cancelled') ?
                                      <Button onClick={completeSubmission}>Complete</Button> :
                                      <label>Completion Date: {data.CompletionDate}</label>
                                  }
                                      {/* <Button onClick={()=>sendEmail('submit')}>Send</Button> */}
                                </div>
                                </div> 
                              </div> 
                      </div>
                      <br/> 
                      </div> 
                      {/* Add more tab content here */}
                      </div>
                </div>
                
                {/* page content begin here */}
                { validate() && 
                  <div className="container-fluid">
                      <div className="row justify-content-center">
                          <div className="col-xl-8 col-lg-7">
                              <div className="card shadow mb-4">
                                  {/* Card Header - New Hire Upload */}
                                  <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                      <h6 className="m-0 font-weight-bold text-primary">Details</h6>
                                  </div>
                                  {/* Card Body - New Hire Options */}
                                    <div className="card-body">
                                        <div className="tab-content">
                                          <div className="card-body">
                                              {data.CorrectName && 
                                              <div className="form-group">
                                                  <label htmlFor="correctName">Correct Name</label>
                                                  <input type="text" className="form-control" id="correctName" name="correctName" disabled value={data.CorrectName}/>
                                              </div>
                                              }
                                              {data.DeductionFor && 
                                              <div className="form-group">
                                                  <label htmlFor="deductionFor">Stop Deduction For</label>
                                                  <input type="text" className="form-control" id="deductionFor" name="deductionFor" disabled value={data.DeductionFor}/>
                                              </div>
                                              }
                                              {data.RequestTitle && 
                                              <div className="form-group">
                                                  <label htmlFor="requestTitle">Request Title</label>
                                                  <input type="text" className="form-control" id="requestTitle" name="requestTitle" disabled value={data.RequestTitle}/>
                                              </div>
                                              }
                                              {data.Description && 
                                              <div className="form-group">
                                                  <label htmlFor="description">Description</label>
                                                  <input type="text" className="form-control" id="description" name="description" disabled value={data.Description}/>
                                              </div>
                                              }
                                              {data.ErroneousName && 
                                              <div className="form-group">
                                                  <label htmlFor="erroneousName">Erroneous Name</label>
                                                  <input type="text" className="form-control" id="erroneousName" name="erroneousName" disabled value={data.ErroneousName}/>
                                              </div>
                                              }
                                              {data.LoanAppDate && 
                                              <div className="form-group">
                                                  <label htmlFor="loanAppDate">Loan Application Date</label>
                                                  <input type="date" className="form-control" id="loanAppDate" name="loanAppDate" disabled value={data.LoanAppDate}/>
                                              </div>
                                              }
                                              {data.OtherReq && 
                                              <div className="form-group">
                                                  <label htmlFor="otherReq">Other Request</label>
                                                  <input type="text" className="form-control" id="otherReq" name="otherReq" disabled value={data.OtherReq}/>
                                              </div>
                                              }
                                              {data.ReasonType && 
                                              <div className="form-group">
                                                  <label htmlFor="reasonType">Reason Type</label>
                                                  <input type="text" className="form-control" id="reasonType" name="reasonType" disabled value={data.ReasonType}/>
                                              </div>
                                              }
                                              {data.RequestType && 
                                              <div className="form-group">
                                                  <label htmlFor="requestType">Request Type</label>
                                                  <input type="text" className="form-control" id="requestType" name="requestType" disabled value={data.RequestType}/>
                                              </div>
                                              } 
                                              {data.TransactionNum && 
                                              <div className="form-group">
                                                  <label htmlFor="transactionNum">Transaction Number</label>
                                                  <input type="text" className="form-control" id="transactionNum" name="transactionNum" disabled value={data.TransactionNum}/>
                                              </div>
                                              }
                                              {data.TypeOfDelivery && 
                                              <div className="form-group">
                                                  <label htmlFor="typeOfDelivery">Type of Delivery</label>
                                                  <input type="text" className="form-control" id="typeOfDelivery" name="typeOfDelivery" disabled value={data.TypeOfDelivery}/>
                                              </div>
                                              }
                                              {data.PlaceOfConfinement && 
                                              <div className="form-group">
                                                  <label htmlFor="typeOfDelivery">Place of Confinement</label>
                                                  <input type="text" className="form-control" id="typeOfDelivery" name="typeOfDelivery" disabled value={data.PlaceOfConfinement}/>
                                              </div>
                                              }
                                              {data.BankAccNumber && 
                                              <div className="form-group">
                                                  <label htmlFor="typeOfDelivery">Bank Account Number</label>
                                                  <input type="text" className="form-control" id="typeOfDelivery" name="typeOfDelivery" disabled value={data.BankAccNumber}/>
                                              </div>
                                              }
                                              {data.CompletionDate && 
                                              <div className="form-group">
                                                  <label htmlFor="typeOfDelivery">Completion Date</label>
                                                  <input type="text" className="form-control" id="typeOfDelivery" name="typeOfDelivery" disabled value={data.CompletionDate}/>
                                              </div>
                                              } 
                                              
                                              {data.ReasonForInfoUpdate && 
                                              <div className="form-group">
                                                  <label htmlFor="typeOfDelivery">Reason For Information Update</label>
                                                  <input type="text" className="form-control" id="typeOfDelivery" name="typeOfDelivery" disabled value={data.ReasonForInfoUpdate}/>
                                              </div>
                                              }
                                              {data.CurrentFullname && 
                                              <div className="form-group">
                                                  <label htmlFor="typeOfDelivery">Current Full Name</label>
                                                  <input type="text" className="form-control" id="typeOfDelivery" name="typeOfDelivery" disabled value={data.CurrentFullname}/>
                                              </div>
                                              }
                                              {data.NewFullname && 
                                              <div className="form-group">
                                                  <label htmlFor="typeOfDelivery">New Full Name</label>
                                                  <input type="text" className="form-control" id="typeOfDelivery" name="typeOfDelivery" disabled value={data.NewFullname}/>
                                              </div>
                                              }
                                              {data.CurrentCivilStatus && 
                                              <div className="form-group">
                                                  <label htmlFor="typeOfDelivery">Current Civil Status</label>
                                                  <input type="text" className="form-control" id="typeOfDelivery" name="typeOfDelivery" disabled value={data.CurrentCivilStatus}/>
                                              </div>
                                              }
                                              {data.NewCivilStatus && 
                                              <div className="form-group">
                                                  <label htmlFor="typeOfDelivery">New Civil Status</label>
                                                  <input type="text" className="form-control" id="typeOfDelivery" name="typeOfDelivery" disabled value={data.NewCivilStatus}/>
                                              </div>
                                              }
                                          </div> 
                                        </div>
                                    </div>
                              </div>
                          </div>
                      </div>
                  </div>
                }
                {/* Page content ends here */}

                {/* page content begin here */}   
                {pdf && pdf.map((pdf, index) =>
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-xl-8 col-lg-7">
                            <div className="card shadow mb-4">
                                {/* Card Header - New Hire Upload */}
                                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                    <h6 className="m-0 font-weight-bold text-primary">{pdf.RequirementName}</h6> 
                                </div>
                                {/* Card Body - New Hire Options */}
                                <div className="card-body">
                                    <div className="tab-content">
                                        <div className="card-body">
                                          <div className="d-flex justify-content-between align-items-center">
                                            <div> 
                                              <button onClick={() => handleButtonClick(pdf)}>
                                                View File
                                              </button>
                                              <button onClick={() => convertAndDownloadPDF(pdf.PdfData,pdf.FileName)} className='btnClose'>
                                                Download
                                              </button>
                                              <label>{pdf.FileName}</label>
                                            </div>
                                            <label>{pdf.UploadDate}</label>
                                            <div>  
                                              <label for="toggle" className="toggle-label mr-2">{pdf.Updated ? 'Resubmission': 
                                              (data.Status !== 'Complete' && data.Status !== 'Expired') && 'Resubmit'}</label>

                                              {pdf.Updated ? 
                                              <label className="toggle-label mr-2">{pdf.EmpResubmitted ? '- Complete':'- Pending'}</label>
                                              :
                                              (data.Status !== 'Complete' && data.Status !== 'Expired') &&
                                              <input type="checkbox" id="toggle" className="toggle-input" onChange={(e)=>checkbox(pdf.PdfFileID, e)} 
                                                checked={pdf.Resubmit}
                                              />     
                                              }
                                            </div>
                                          </div>
                                          {pdf.Resubmit && !pdf.Updated ? 
                                            <div>
                                                {/* Card Header - New Hire Upload */}
                                                <div className="py-3 align-items-center justify-content-between">
                                                    <label className="mt-2 font-weight-bold text-primary">Reason</label>
                                                    <label className="ml-1 font-weight-bold text-danger">*</label> 
                                                </div> 
                                                <div>
                                                    <div className="">
                                                        <div className=" loan-row"> 
                                                            <div className="form-group"> <textarea 
                                                              className="form-control" 
                                                              id="remark" 
                                                              name="remark"
                                                              rows="3" 
                                                              style={{ resize: "both" }}
                                                              onChange={(e)=>resubmitReason(pdf.PdfFileID,e)}
                                                              value={pdf.ResubmitReason}
                                                            /> 
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>:''
                                          }
                                          {pdf.Updated ? 
                                          <div>
                                              {/* Card Header - New Hire Upload */}
                                              <div className="py-3 align-items-center justify-content-between">
                                                  <label className="mt-2 font-weight-bold text-danger">Reason:</label>
                                                  <label className="ml-1">{pdf.ResubmitReason}</label> 
                                              </div>  
                                          </div>:''
                                          }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )} 
                {/* Page content ends here */}
 
                {data.Status !== 'Complete' &&
                  <button type="submit" className="btn btn-primary d-block mx-auto" onClick={handleFormSubmit}>Submit</button>
                }
                {/* </form> */}
              </div>

              

              </div> 
                <Modal show={showModal} onHide={handleCloseModal} size="lg">
                  <Modal.Header>
                    <Modal.Title>*File name</Modal.Title>
                    <div>
                      <button type="button" className="btnClose" onClick={handleCloseModal}>Close</button>
                    </div>
                  </Modal.Header>
                  <Modal.Body style={{backgroundColor: 'lightgray'}}>   
                    {pdfUrl && <Document
                        file={pdfUrl} 
                        onLoadSuccess={({ numPages })=>setNumPages(numPages)} 
                    >
                        {Array.apply(null, Array(numPages))
                        .map((x, i)=>i+1)
                        .map(page => 
                          <div style={{ marginBottom: '20px' }}>
                            <Page
                              pageNumber={page}
                              renderAnnotationLayer={false}
                              renderTextLayer={false}
                            />
                          </div>)}
                    </Document>}
                    {imageUrl && <img src={imageUrl} alt="Converted Image" />}
                  </Modal.Body>
                  <Modal.Footer> 
                    <div>
                      <button type="button" className="btnClose" onClick={handleCloseModal}>Close</button>
                    </div>
                  </Modal.Footer>
                </Modal>

              </div>
              </div>
              <Footer />
          </div>
      </div>
  );
}

export default RequestView;

