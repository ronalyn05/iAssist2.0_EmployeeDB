import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../navbar';
import TopNavbar from '../topnavbar';
import Footer from '../footer';
import '../../App.css';
import { variables } from '../../variables';
import { base64pdf } from '../../vblob';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import "react-pdf/dist/esm/Page/TextLayer.css"; 

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Document, Page,pdfjs } from 'react-pdf'; 


 function RequestView() {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`; 

    const location = useLocation();
    const data = location.state.data;

    // console.log(location.state.EmpID);

    const { employeeId } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1); 
    const [pdfUrl, setPdfUrl] = useState(''); 
    const [imageUrl, setImageUrl] = useState('');
    

    const [pdf, setPdf] = useState([]);
    const [pdfResubmit, setPdfResubmit] = useState([]);

    const [resubmitFiles, setResubmitFiles] = useState([]);
  
    // const handleResubmitPDF = (e) => {
    //   setResubmitFiles([...resubmitFiles, ...e.target.files]);
    // };

    const handleResubmitPDF = (e, requirementName, PdfFileID) => {
      // Combine the file with its corresponding RequirementName
      const thisSubmissionID = data.SubmissionID;

      const fileWithRequirementName = { file: e.target.files[0], requirementName, PdfFileID, thisSubmissionID};
      setResubmitFiles([...resubmitFiles, fileWithRequirementName]);
    };
    
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
      console.log(base64)
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
    }, []); 
 
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
            const sortedData = responseData.result.sort((a, b) => { 
                if (a.RequirementName !== b.RequirementName) {
                    return a.RequirementName.localeCompare(b.RequirementName);
                } else { 
                    return b.Updated - a.Updated;
                }
            }); 
            
            setPdf(sortedData);
            
          } catch (error) {
              console.error('Error parsing JSON response:', error);
          }
       
        } catch (error) {
          console.error('Error uploading PDF:', error);
        }
      }; 

      const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Check if any required field is empty
        if (resubmitFiles.length === 0) {
          // If the file is not selected, show a warning toast
          toast.warn('Please select a file to submit', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return; // Stop form submission
        }
      
        const formData = new FormData();
        resubmitFiles.forEach((file) => {
          formData.append('newPDF', file.file); // Append only the file
          formData.append('requirementName', file.requirementName.toString()); // Append the requirementName
          formData.append('PdfFileID', file.PdfFileID); // Append the PdfFileID
          formData.append('SubmissionID', file.thisSubmissionID); // Append the PdfFileID
        });


        try {
          const response = await fetch('http://localhost:5000/resubmitPDF', {
            method: 'POST',
            body: formData,
          }); 
          if (response.ok) {
            const jsonResponse = await response.json();

            console.log(jsonResponse.message);
            
            setTimeout(() => {
              window.location.reload();
            }, 2500);
            
            // Emit success toast
            toast.success('Submitted Successfully', {
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setResubmitFiles([]);
          } else {
            console.error('Failed to upload PDF:', response.statusText);
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
          console.error('Error uploading PDF:', error);
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
    
    
    const handleCancel = async () => {
        const thisAction = "Cancelled"; 

        const formData = new FormData();
        formData.append('thisAction', thisAction);
        formData.append('thisSubmissionID', data.SubmissionID);

        try {
          const response = await fetch('http://localhost:5000/UpdateRequest', {
            method: 'POST',
            body: formData,
          }); 
          if (response.ok) {
            const jsonResponse = await response.json();

            console.log(jsonResponse.message);
            
            // Emit success toast
            toast.success('Submitted Successfully', {
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });

            setTimeout(() => {
              window.location.href = '/submissions';
            }, 2300);

          } else {
            console.error('Failed to upload PDF:', response.statusText);
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
        console.error('Error updating failed:', error);
      }
    };

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
          <div className="row justify-content-center">
            <div className="col-xl-12 col-xl-9">
            {/* <form onSubmit={handleFormSubmit}> */}
              <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <ul className="nav nav-tabs nav-fill">
                        <li className="nav-item">
                            <a className="nav-link active " id="personalDetails-tab" data-toggle="tab" href="#personalDetails" role="tab" aria-controls="personalDetails" 
                            aria-selected="false">{data.TransactionType}</a>
                        </li> 
                    </ul>
                    </div>
                  <br/>
                    <div className="tab-content">
                      <div className="tab-pane fade show active" id="personalDetails" role="tabpanel" aria-labelledby="personalDetails-tab">
                          {/* Personal Details Form */}
                            <div className="container">
                              <div className="justify-content-center">
                                <div> 
                                  <div className="d-flex justify-content-between">
                                    <label>{data.Name}</label>
                                    <label>{data.DateTime}</label>
                                    <label>{data.TurnAround} Days</label>
                                    <label>{data.Status}</label>
                                      {data.Status === 'Pending' ? (
                                          <Button type="button" onClick={handleCancel}>Cancel</Button>
                                      ) : (
                                          <span></span>
                                      )}
                                    
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
                {validate() && 
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
                {pdf && pdf.map((pdfItem, index) =>
                  <div className="container-fluid" key={index}>
                    <div className="row justify-content-center">
                      <div className="col-xl-8 col-lg-7">
                        <div className="card shadow mb-4">
                          {/* Card Header - New Hire Upload */}
                          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">{pdfItem.RequirementName}</h6>
                            
                            <h6 className="m-0 font-weight-bold" style={{ color: 'red' }}>{pdfItem.Resubmit ? 'Resubmit' : ''}</h6>
                          </div>
                          {/* Card Body - New Hire Options */}
                          <div className="card-body">
                            <div className="tab-content">
                              <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <button onClick={() => handleButtonClick(pdfItem)}>
                                      View File
                                    </button>
                                    <button onClick={() => convertAndDownloadPDF(pdfItem.PdfData, pdfItem.FileName)} className='btnClose'>
                                      Download
                                    </button>
                                    <label>{pdfItem.FileName}</label>
                                  </div>
                                  <label>Date Submitted: {pdfItem.UploadDate}</label>
                                </div>

                                {/* For Resubmission */}
                                {pdfItem.Resubmit === 1 &&
                                  <div className="d-flex justify-content-between">
                                    {pdfItem.EmpResubmitted === 0 &&
                                      <div className="d-flex justify-content-left">
                                        {/* Pass pdf.RequirementName to handleResubmitPDF */}
                                        <input type="file" className="input-file" aria-describedby="fileHelp" onChange={(e) => handleResubmitPDF(e, pdfItem.RequirementName, pdfItem.PdfFileID, location.state.EmpID, data.SubmissionID)} />
                                      </div>}
                                    <label>Reason: {pdfItem.ResubmitReason}</label>
                                  </div>
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

                {/* Page content ends here */} 
                {data.Status === 'Resubmit' ? (
                  <button type="submit" onClick={handleFormSubmit} className="btn btn-primary d-block mx-auto mb-4">Submit</button>
                ) : (
                  <span></span>
                )}
                
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

export default RequestView;
