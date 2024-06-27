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
    const [fileName, setFileName] = useState('');


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
      setFileName(data.FileName);
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
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">Request Details</h6>
                </div>
                <br/>
                <div className="tab-content">
                  <div className="tab-pane fade show active" id="personalDetails" role="tabpanel" aria-labelledby="personalDetails-tab">

                      <div style={{marginRight: '40px'}}>
                        <div style={{marginLeft: '20px'}}>
                          <div>
                          <p className='mb-0'><b className='text-success'>Name:</b> {data.Name}</p>
                          <p className='mb-0'><b className='text-success'>ID:</b> {data.EmpId}</p>
                                    {data.CorrectName && 
                                                <div className="form-group">
                                                    <p className='mb-0'><b className='text-success'>Correct Name:</b> {data.CorrectName}</p>
                                                </div>
                                                }
                                                {data.DeductionFor && 
                                                <div >
                                                  <p className='mb-0'><b className='text-success'>Stop Deduction For:</b> {data.DeductionFor}</p>
                                                </div>
                                                }
                                                {data.RequestTitle && 
                                                <div >
                                                  <p className='mb-0'><b className='text-success'>Request Title:</b> {data.RequestTitle}</p>
                                                </div>
                                                }
                                                {data.Description && 
                                                <div >
                                                  <p className='mb-0'><b className='text-success'>Description:</b> {data.Description}</p>
                                                </div>
                                                }
                                                {data.ErroneousName && 
                                                <div >
                                                  <p className='mb-0'><b className='text-success'>Erroneous Name:</b> {data.ErroneousName}</p>
                                                </div>
                                                }
                                                {data.LoanAppDate && 
                                                <div >
                                                  <p className='mb-0'><b className='text-success'>Loan Application Date:</b> {data.LoanAppDate}</p>
                                                </div>
                                                }
                                                {data.OtherReq && 
                                                <div >
                                                  <p className='mb-0'><b className='text-success'>Other Request:</b> {data.OtherReq}</p>
                                                </div>
                                                }
                                                {data.ReasonType && 
                                                <div >
                                                  <p className='mb-0'><b className='text-success'>Reason Type:</b> {data.ReasonType}</p>
                                                </div>
                                                } 
                                                {data.RequestType && 
                                                <div>
                                                    <p className='mb-0'><b className='text-success'>Request Type:</b> {data.RequestType}</p>
                                                </div>
                                                } 
                                                {data.TransactionNum && 
                                                <div >
                                                  <p className='mb-0'><b className='text-success'>Transaction Number:</b> {data.TransactionNum}</p>
                                                </div>
                                                }
                                                {data.TypeOfDelivery && 
                                                <div >
                                                  <p className='mb-0'><b className='text-success'>Type of Delivery:</b> {data.TypeOfDelivery}</p>
                                                </div>
                                                }
                                                {data.PlaceOfConfinement && 
                                                <div >
                                                  <p className='mb-0'><b className='text-success'>Place of Confinement:</b> {data.PlaceOfConfinement}</p>
                                                </div>
                                                }
                                                {data.BankAccNumber && 
                                                <div >
                                                  <p className='mb-0'><b className='text-success'>Bank Account Number:</b> {data.BankAccNumber}</p>
                                                </div>
                                                }
                                                {data.CompletionDate && 
                                                <div >
                                                  <p className='mb-0'><b className='text-success'>Completion Date:</b> {data.CompletionDate}</p>
                                                </div>
                                                } 
                                                {data.ReasonForInfoUpdate && 
                                                <div >
                                                  <p className='mb-0'><b className='text-success'>Reason For Information Update:</b> {data.ReasonForInfoUpdate}</p>
                                                </div>
                                                }
                                                {data.CurrentFullname && 
                                                <div >
                                                  <p className='mb-0'><b className='text-success'>Current Full Name:</b> {data.CurrentFullname}</p>
                                                </div>
                                                }
                                                {data.NewFullname && 
                                                <div >
                                                  <p className='mb-0'><b className='text-success'>New Full Name:</b> {data.NewFullname}</p>
                                                </div>
                                                }
                                                {data.CurrentCivilStatus && 
                                                <div >
                                                  <p className='mb-0'><b className='text-success'>Current Civil Status:</b> {data.CurrentCivilStatus}</p>
                                                </div>
                                                }
                                                {data.NewCivilStatus && 
                                                <div >
                                                  <p className='mb-0'><b className='text-success'>New Civil Status:</b> {data.NewCivilStatus}</p>

                                                </div>
                                                }
                                    <p className='mb-0'><b className='text-success'>Date Submitted:</b> {data.DateTime}</p>
                                    <p className='mb-0'><b className='text-success'>Turn Around:</b> {data.TurnAround}</p>
                                    <p className='mb-0'><b className='text-success'>Status: </b> {data.Status}</p>
                                    {(data.Status !== 'Complete' && data.Status !== 'Expired' && data.Status !== 'Cancelled') ?
                                      <Button style={{marginTop: '20px'}} onClick={completeSubmission}>Complete</Button> :

                                      <p className='mb-0'><b className='text-success'>Completion Date:</b> {data.CompletionDate}</p>
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
                                              <p className='mb-0'><b className='text-success'>Document:</b> {pdf.FileName}</p>
                                              <p className='mb-0'><b className='text-success'>Date Submitted:</b> {pdf.UploadDate}</p>
                                              <p className='mb-0'>
                                                {(data.Status !== 'Complete' && data.Status !== 'Expired') && <b className='text-success'>Status: </b> }
                                                <label for="toggle" className="toggle-label mr-2">
                                                  {pdf.Updated ? 'Resubmission': (data.Status !== 'Complete' && data.Status !== 'Expired') && 'Resubmit'}
                                                </label>
                                                  {pdf.Updated ? 
                                                  <label className="toggle-label mr-2">{pdf.EmpResubmitted ? '- Complete':'- Pending'}</label>
                                                  :
                                                  (data.Status !== 'Complete' && data.Status !== 'Expired') &&
                                                  <input type="checkbox" id="toggle" className="toggle-input" onChange={(e)=>checkbox(pdf.PdfFileID, e)} 
                                                    checked={pdf.Resubmit}

                                                  />     
                                                  }
                                              </p>
                                            </div>
                                            

                                            <div className="col-md-4 text-center">
                                              <button className="btnClose btn-danger btn-sm mr-2" onClick={() => handleButtonClick(pdf)}>
                                                View
                                              </button>
                                              <button className="btnClose btn-sm btn-primary" onClick={() => convertAndDownloadPDF(pdf.PdfData,pdf.FileName)}>
                                                Download
                                              </button>
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
                    <Modal.Title>{fileName}</Modal.Title>
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

