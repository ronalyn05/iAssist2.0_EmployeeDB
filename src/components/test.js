import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './navbar';
import TopNavbar from './topnavbar';
import Footer from './footer';
import '../App.css';
import { variables } from '../variables';

function Test() {
  const { employeeId } = useParams();
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please select a PDF file.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

    //   const response = await fetch(variables.API_URL + 'UploadEmp/' + employeeId, {
    //     method: 'PUT',
    //     body: formData
    //   });

    //   if (!response.ok) {
    //     throw new Error('Failed to upload file');
    //   }
        console.log(file)

      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div id="wrapper">
      <Navbar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <TopNavbar />
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-xl-12 col-xl-9">
                <div className="card shadow mb-4">
                  <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <ul className="nav nav-tabs nav-fill">
                      <li className="nav-item">
                        <a className="nav-link active" id="personalDetails-tab" data-toggle="tab" href="#personalDetails" role="tab" aria-controls="personalDetails" aria-selected="false">SSS Loan</a>
                      </li>
                    </ul>
                  </div>
                  <br />
                  <div className="tab-content">
                    <div className="tab-pane fade show active" id="personalDetails" role="tabpanel" aria-labelledby="personalDetails-tab">
                      {/* Personal Details Form */}
                      <div className="container">
                        <form onSubmit={handleFormSubmit}>
                          <div className="row justify-content-center">
                            <div className="col-md-4">
                              <div className="form-group">
                                <label htmlFor="age">Loan Disclosure Statement</label>
                                <input type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleFileChange} accept=".pdf" />
                                <small id="fileHelp" className="form-text text-muted">Choose a PDF file to upload.</small>
                              </div>
                            </div>
                          </div>
                          <button type="submit" className="btn btn-primary d-block mx-auto">Submit</button>
                        </form>
                      </div>
                      <br />
                    </div>
                    {/* Add more tab content here */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Test;
