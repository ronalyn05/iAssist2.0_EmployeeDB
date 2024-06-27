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
    const [fileName, setFileName] = useState('');
    

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
                    <h6 className="m-0 font-weight-bold text-primary">Request Details</h6>
                    </div>
                  <br/>
                    <div className="tab-content">
                      <div className="tab-pane fade show active" id="personalDetails" role="tabpanel" aria-labelledby="personalDetails-tab">
                          {/* Personal Details Form */}
                            <div style={{marginRight: '40px'}}>
                              <div style={{marginLeft: '20px'}}>
                                <div> 
                                  <div>
                                    <div>
                                    {/* <p className='mb-0'><b className='text-success'>Transaction Request:</b> {data.TransactionType}</p> */}
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
                                    </div>
                                    {data.Status === 'Pending' ? (
                                        <Button style={{marginTop: '20px'}} type="button" onClick={handleCancel}>
                                            Cancel
                                        </Button>
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
                {pdf && pdf.map((pdfItem, index) =>
                  <div className="container-fluid" key={index}>
                    <div className="row justify-content-center">
                      <div className="col-xl-9 col-lg-7">
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
                                    <p className='mb-0'><b className='text-success'>Document:</b> {pdfItem.FileName}</p>
                                    <p className='mb-0'><b className='text-success'>Date Submitted:</b> {pdfItem.UploadDate}</p>
                                    <p className='mb-3 mt-5'><b className='text-error'>Reason:</b> {pdfItem.ResubmitReason}</p>

                                  </div>
                                  <div className="col-md-4 text-center">
                                    <button className="btn btn-danger btn-sm mr-2" onClick={() => handleButtonClick(pdfItem)}>
                                      View
                                    </button>
                                    <button className="btn btn-sm btn-primary" onClick={() => convertAndDownloadPDF(pdfItem.PdfData, pdfItem.FileName)}>
                                      Download
                                    </button>
                                    
                                  </div>

                                </div>

                                {/* For Resubmission */}
                                {pdfItem.Resubmit === 1 &&
                                  <div className="d-flex justify-content-between">
                                    {pdfItem.EmpResubmitted === 0 &&
                                      <div className="d-flex justify-content-left">
                                        {/* Pass pdf.RequirementName to handleResubmitPDF */}
                                        <input type="file" className="input-file" aria-describedby="fileHelp" onChange={(e) => handleResubmitPDF(e, pdfItem.RequirementName, pdfItem.PdfFileID, location.state.EmpID, data.SubmissionID)} />
                                      </div>}
                                    
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
                    <Modal.Title>{fileName}</Modal.Title>
                    
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
