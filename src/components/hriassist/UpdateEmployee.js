import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../navbar';
import TopNavbar from '../topnavbar';
import Footer from '../footer';
import '../../App.css';
import { sendEmail } from '../globalFunctions';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UpdateEmployee() {

    const EmployeeId = sessionStorage.getItem("employeeId");

    const [thisInfo, setThisInfo] = useState({
        ReasonForInfoUpdate: "",
        SignedLetter: "",
        CurrentFullname: "",
        NewFullname: "",
        CurrentCivilStatus: "",
        NewCivilStatus: "",
        OtherContract: ""
    });

    // useEffect(() => {
    //     [EmployeeId];
    // });

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('currentEmployeeId', EmployeeId);
        
        const isValidFileType = (file) => {
            const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
            return allowedTypes.includes(file.type);
        };

        let InfoUpdate = "";
        if(thisInfo.ReasonForInfoUpdate === '1'){
            InfoUpdate = "From Single to Married";
            document.getElementById('InformationUpdateInvalid').style.border = '';
            document.getElementById('SignedLetterInvalid').style.border = '';
            document.getElementById('CurrentFullnameInvalid').style.border = '';
            document.getElementById('NewFullnameInvalid').style.border = '';
            document.getElementById('CurrentCivilInvalid').style.border = '';
            document.getElementById('NewCivilInvalid').style.border = '';
            document.getElementById('OtherContractInvalid').style.border = '';
            formData.append("ReasonForInfoUpdate", InfoUpdate);

        }else if(thisInfo.ReasonForInfoUpdate === '2'){
            InfoUpdate = "From Married to Single";
            document.getElementById('InformationUpdateInvalid').style.border = '';
            document.getElementById('SignedLetterInvalid').style.border = '';
            document.getElementById('CurrentFullnameInvalid').style.border = '';
            document.getElementById('NewFullnameInvalid').style.border = '';
            document.getElementById('CurrentCivilInvalid').style.border = '';
            document.getElementById('NewCivilInvalid').style.border = '';
            document.getElementById('OtherContractInvalid').style.border = '';
            formData.append("ReasonForInfoUpdate", InfoUpdate);

        }else{
            document.getElementById('InformationUpdateInvalid').style.border = '1px solid red';
            document.getElementById('SignedLetterInvalid').style.border = '';
            document.getElementById('CurrentFullnameInvalid').style.border = '';
            document.getElementById('NewFullnameInvalid').style.border = '';
            document.getElementById('CurrentCivilInvalid').style.border = '';
            document.getElementById('NewCivilInvalid').style.border = '';
            document.getElementById('OtherContractInvalid').style.border = '';
            toast.error('Please select an reason for information update.', {
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

        if (thisInfo.SignedLetter && isValidFileType(thisInfo.SignedLetter)) {
            formData.append("SignedLetter", thisInfo.SignedLetter);
            document.getElementById('InformationUpdateInvalid').style.border = '';
            document.getElementById('SignedLetterInvalid').style.border = '';
            document.getElementById('CurrentFullnameInvalid').style.border = '';
            document.getElementById('NewFullnameInvalid').style.border = '';
            document.getElementById('CurrentCivilInvalid').style.border = '';
            document.getElementById('NewCivilInvalid').style.border = '';
            document.getElementById('OtherContractInvalid').style.border = '';
        } else {
            document.getElementById('InformationUpdateInvalid').style.border = '';
            document.getElementById('SignedLetterInvalid').style.border = '1px solid red';
            document.getElementById('CurrentFullnameInvalid').style.border = '';
            document.getElementById('NewFullnameInvalid').style.border = '';
            document.getElementById('CurrentCivilInvalid').style.border = '';
            document.getElementById('NewCivilInvalid').style.border = '';
            document.getElementById('OtherContractInvalid').style.border = '';
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

        if(!thisInfo.CurrentFullname){
            document.getElementById('InformationUpdateInvalid').style.border = '';
            document.getElementById('SignedLetterInvalid').style.border = '';
            document.getElementById('CurrentFullnameInvalid').style.border = '1px solid red';
            document.getElementById('NewFullnameInvalid').style.border = '';
            document.getElementById('CurrentCivilInvalid').style.border = '';
            document.getElementById('NewCivilInvalid').style.border = '';
            document.getElementById('OtherContractInvalid').style.border = '';
            toast.error('Something went wrong, Please enter your current full name.', {
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
            document.getElementById('InformationUpdateInvalid').style.border = '';
            document.getElementById('SignedLetterInvalid').style.border = '';
            document.getElementById('CurrentFullnameInvalid').style.border = '';
            document.getElementById('NewFullnameInvalid').style.border = '';
            document.getElementById('CurrentCivilInvalid').style.border = '';
            document.getElementById('NewCivilInvalid').style.border = '';
            document.getElementById('OtherContractInvalid').style.border = '';
            formData.append("CurrentFullname", thisInfo.CurrentFullname);
        }

        if(!thisInfo.NewFullname){
            document.getElementById('InformationUpdateInvalid').style.border = '';
            document.getElementById('SignedLetterInvalid').style.border = '';
            document.getElementById('CurrentFullnameInvalid').style.border = '';
            document.getElementById('NewFullnameInvalid').style.border = '1px solid red';
            document.getElementById('CurrentCivilInvalid').style.border = '';
            document.getElementById('NewCivilInvalid').style.border = '';
            document.getElementById('OtherContractInvalid').style.border = '';
            toast.error('Something went wrong, Please enter your new full name.', {
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
            document.getElementById('InformationUpdateInvalid').style.border = '';
            document.getElementById('SignedLetterInvalid').style.border = '';
            document.getElementById('CurrentFullnameInvalid').style.border = '';
            document.getElementById('NewFullnameInvalid').style.border = '';
            document.getElementById('CurrentCivilInvalid').style.border = '';
            document.getElementById('NewCivilInvalid').style.border = '';
            formData.append("NewFullname", thisInfo.NewFullname);
            document.getElementById('OtherContractInvalid').style.border = '';
        }
        
        if(thisInfo.CurrentCivilStatus !== ''){
            let CCStatus = "";
            if(thisInfo.CurrentCivilStatus === '1'){
                CCStatus = "Single";
                document.getElementById('InformationUpdateInvalid').style.border = '';
                document.getElementById('SignedLetterInvalid').style.border = '';
                document.getElementById('CurrentFullnameInvalid').style.border = '';
                document.getElementById('NewFullnameInvalid').style.border = '';
                document.getElementById('CurrentCivilInvalid').style.border = '';
                document.getElementById('NewCivilInvalid').style.border = '';
                document.getElementById('OtherContractInvalid').style.border = '';
                formData.append("CurrentCivilStatus", CCStatus);
            }else if(thisInfo.CurrentCivilStatus === '2'){
                CCStatus = "Married";
                document.getElementById('InformationUpdateInvalid').style.border = '';
                document.getElementById('SignedLetterInvalid').style.border = '';
                document.getElementById('CurrentFullnameInvalid').style.border = '';
                document.getElementById('NewFullnameInvalid').style.border = '';
                document.getElementById('CurrentCivilInvalid').style.border = '';
                document.getElementById('NewCivilInvalid').style.border = '';
                document.getElementById('OtherContractInvalid').style.border = '';
                formData.append("CurrentCivilStatus", CCStatus);
            }else if(thisInfo.CurrentCivilStatus === '3'){
                CCStatus = "Separated";
                document.getElementById('InformationUpdateInvalid').style.border = '';
                document.getElementById('SignedLetterInvalid').style.border = '';
                document.getElementById('CurrentFullnameInvalid').style.border = '';
                document.getElementById('NewFullnameInvalid').style.border = '';
                document.getElementById('CurrentCivilInvalid').style.border = '';
                document.getElementById('NewCivilInvalid').style.border = '';
                document.getElementById('OtherContractInvalid').style.border = '';
                formData.append("CurrentCivilStatus", CCStatus);
            }else if(thisInfo.CurrentCivilStatus === '4'){
                CCStatus = "Divorced";
                document.getElementById('InformationUpdateInvalid').style.border = '';
                document.getElementById('SignedLetterInvalid').style.border = '';
                document.getElementById('CurrentFullnameInvalid').style.border = '';
                document.getElementById('NewFullnameInvalid').style.border = '';
                document.getElementById('CurrentCivilInvalid').style.border = '';
                document.getElementById('NewCivilInvalid').style.border = '';
                document.getElementById('OtherContractInvalid').style.border = '';
                formData.append("CurrentCivilStatus", CCStatus);
            }else if(thisInfo.CurrentCivilStatus === '5'){
                CCStatus = "Widowed";
                document.getElementById('InformationUpdateInvalid').style.border = '';
                document.getElementById('SignedLetterInvalid').style.border = '';
                document.getElementById('CurrentFullnameInvalid').style.border = '';
                document.getElementById('NewFullnameInvalid').style.border = '';
                document.getElementById('CurrentCivilInvalid').style.border = '';
                document.getElementById('NewCivilInvalid').style.border = '';
                document.getElementById('OtherContractInvalid').style.border = '';
                formData.append("CurrentCivilStatus", CCStatus);
            }
        }else{
            document.getElementById('InformationUpdateInvalid').style.border = '';
            document.getElementById('SignedLetterInvalid').style.border = '';
            document.getElementById('CurrentFullnameInvalid').style.border = '';
            document.getElementById('NewFullnameInvalid').style.border = '';
            document.getElementById('CurrentCivilInvalid').style.border = '1px solid red';
            document.getElementById('NewCivilInvalid').style.border = '';
            document.getElementById('OtherContractInvalid').style.border = '';
            toast.error('Something went wrong, Please enter your current full name.', {
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
        if(thisInfo.NewCivilStatus !== ''){
            let NCStatus = "";
            if(thisInfo.NewCivilStatus === '1'){
                NCStatus = "Single";
                    document.getElementById('InformationUpdateInvalid').style.border = '';
                    document.getElementById('SignedLetterInvalid').style.border = '';
                    document.getElementById('CurrentFullnameInvalid').style.border = '';
                    document.getElementById('NewFullnameInvalid').style.border = '';
                    document.getElementById('CurrentCivilInvalid').style.border = '';
                    document.getElementById('NewCivilInvalid').style.border = '';
                    document.getElementById('OtherContractInvalid').style.border = '';
                  formData.append("NewCivilInvalid", NCStatus);
                NCStatus = "Married";
                    document.getElementById('InformationUpdateInvalid').style.border = '';
                    document.getElementById('SignedLetterInvalid').style.border = '';
                    document.getElementById('CurrentFullnameInvalid').style.border = '';
                    document.getElementById('NewFullnameInvalid').style.border = '';
                    document.getElementById('CurrentCivilInvalid').style.border = '';
                    document.getElementById('NewCivilInvalid').style.border = '';
                    document.getElementById('OtherContractInvalid').style.border = '';
                  formData.append("NewCivilInvalid", NCStatus);
                NCStatus = "Separated";
                    document.getElementById('InformationUpdateInvalid').style.border = '';
                    document.getElementById('SignedLetterInvalid').style.border = '';
                    document.getElementById('CurrentFullnameInvalid').style.border = '';
                    document.getElementById('NewFullnameInvalid').style.border = '';
                    document.getElementById('CurrentCivilInvalid').style.border = '';
                    document.getElementById('NewCivilInvalid').style.border = '';
                    document.getElementById('OtherContractInvalid').style.border = '';
                  formData.append("NewCivilStatus", NCStatus);
            }else if(thisInfo.NewCivilStatus === '4'){
                NCStatus = "Divorced";
                    document.getElementById('InformationUpdateInvalid').style.border = '';
                    document.getElementById('SignedLetterInvalid').style.border = '';
                    document.getElementById('CurrentFullnameInvalid').style.border = '';
                    document.getElementById('NewFullnameInvalid').style.border = '';
                    document.getElementById('CurrentCivilInvalid').style.border = '';
                    document.getElementById('NewCivilInvalid').style.border = '';
                    document.getElementById('OtherContractInvalid').style.border = '';
                  formData.append("NewCivilStatus", NCStatus);
            }else if(thisInfo.NewCivilStatus === '5'){
                NCStatus = "Widowed";
                document.getElementById('InformationUpdateInvalid').style.border = '';
                document.getElementById('SignedLetterInvalid').style.border = '';
                document.getElementById('CurrentFullnameInvalid').style.border = '';
                document.getElementById('NewFullnameInvalid').style.border = '';
                document.getElementById('CurrentCivilInvalid').style.border = '';
                document.getElementById('NewCivilInvalid').style.border = '';
                document.getElementById('OtherContractInvalid').style.border = '';
                document.getElementById('OtherContractInvalid').style.border = '';
                formData.append("NewCivilStatus", NCStatus);
            }
        }else{
            document.getElementById('InformationUpdateInvalid').style.border = '';
            document.getElementById('SignedLetterInvalid').style.border = '';
            document.getElementById('CurrentFullnameInvalid').style.border = '';
            document.getElementById('NewFullnameInvalid').style.border = '';
            document.getElementById('CurrentCivilInvalid').style.border = '';
            document.getElementById('NewCivilInvalid').style.border = '1px solid red';
            document.getElementById('OtherContractInvalid').style.border = '';
            toast.error('Something went wrong, Please enter your new full name.', {
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
        
        if (thisInfo.OtherContract && isValidFileType(thisInfo.OtherContract)) {
            formData.append("OtherContract", thisInfo.OtherContract);
            document.getElementById('InformationUpdateInvalid').style.border = '';
            document.getElementById('SignedLetterInvalid').style.border = '';
            document.getElementById('CurrentFullnameInvalid').style.border = '';
            document.getElementById('NewFullnameInvalid').style.border = '';
            document.getElementById('CurrentCivilInvalid').style.border = '';
            document.getElementById('NewCivilInvalid').style.border = '';
            document.getElementById('OtherContractInvalid').style.border = '';
        } else {
            document.getElementById('InformationUpdateInvalid').style.border = '';
            document.getElementById('SignedLetterInvalid').style.border = '';
            document.getElementById('CurrentFullnameInvalid').style.border = '';
            document.getElementById('NewFullnameInvalid').style.border = '';
            document.getElementById('CurrentCivilInvalid').style.border = '';
            document.getElementById('NewCivilInvalid').style.border = '';
            document.getElementById('OtherContractInvalid').style.border = '1px solid red';
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

            const response = await fetch('/UpdateEmployeeInformation', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                const jsonResponse = await response.json();
                console.log(jsonResponse.message);
    
                setThisInfo({
                    ReasonForInfoUpdate: '',
                    SignedLetter: '',
                    CurrentFullname: '',
                    NewFullname: '',
                    CurrentCivilStatus: '',
                    NewCivilStatus: '',
                    OtherContract: '',
                });
    
                // Clear file input fields
                document.getElementById('ReasonForInfoUpdate').value = null;
                document.getElementById('SignedLetter').value = null;
                document.getElementById('CurrentFullname').value = null;
                document.getElementById('NewFullname').value = null;
                document.getElementById('CurrentCivilStatus').value = null;
                document.getElementById('NewCivilStatus').value = null;
                document.getElementById('OtherContract').value = null;
    
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
    
    const handleReasonForInfoUpdate = (e) => {
        setThisInfo({ ...thisInfo, ReasonForInfoUpdate: e.target.value });
    };
    const handleSignedLetter = (e) => {
        setThisInfo({ ...thisInfo, SignedLetter: e.target.files[0] });
    };
    const handleCurrentFullname = (e) => {
        setThisInfo({ ...thisInfo, CurrentFullname: e.target.value });
    };
    const handleNewFullname = (e) => {
        setThisInfo({ ...thisInfo, NewFullname: e.target.value });
    };
    const handleCurrentCivilStatus = (e) => {
        setThisInfo({ ...thisInfo, CurrentCivilStatus: e.target.value });
    };
    const handleNewCivilStatus = (e) => {
        setThisInfo({ ...thisInfo, NewCivilStatus: e.target.value });
    };
    const handleOtherContract = (e) => {
        setThisInfo({ ...thisInfo, OtherContract: e.target.files[0] });
    };
    

  const SendEmailNotification= () => {
        
    const content = {
        HrName: '',
        HrEmail: '', // hr's email
        Name: sessionStorage.getItem("firstName") + " " + sessionStorage.getItem("lastName"),
        EmailAddress: sessionStorage.getItem("email"), // employee's email
        TransactionType: 'Update Employee Information',
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
                            <h4 className="m-0 font-weight-bold text-primary header-name">Employee Information Update</h4>
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
                                            <h6 className="m-0 font-weight-bold text-primary">Reason for Information Update *</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body" id='InformationUpdateInvalid'>
                                            <div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="ReasonForInfoUpdate"  
                                                        id="ReasonForInfoUpdate"
                                                        value="1"
                                                        checked={thisInfo.ReasonForInfoUpdate === '1'}  // Compare with '1'
                                                        onChange={handleReasonForInfoUpdate}
                                                    />
                                                    <label className="form-check-label" htmlFor="homeConfinement">
                                                        From Single to Married
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="ReasonForInfoUpdate"  
                                                        id="ReasonForInfoUpdate"
                                                        value="2"
                                                        checked={thisInfo.ReasonForInfoUpdate === '2'}  // Compare with '2'
                                                        onChange={handleReasonForInfoUpdate}
                                                    />
                                                    <label className="form-check-label" htmlFor="hospitalConfinement">
                                                        From Married to Single
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
                                            <h6 className="m-0 font-weight-bold text-primary">Upload Signed Letter of Request (Non-anonymous question) *</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body" id='SignedLetterInvalid'>
                                            <div className="">
                                                <div className="">
                                                    <input id='SignedLetter' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleSignedLetter} />
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
                                            <h6 className="m-0 font-weight-bold text-primary">Current Fullname *</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body" id='CurrentFullnameInvalid'>
                                            <div className="tab-content">
                                                <div className="card-body">
                                                    <div className="form-group">
                                                        <textarea
                                                            className="form-control text-gray-700"
                                                            style={{ height: '40px' }} // This line sets the height to 100px
                                                            id="CurrentFullname"
                                                            name="CurrentFullname"
                                                            value={thisInfo.CurrentFullname}
                                                            onChange={handleCurrentFullname}
                                                            placeholder="Enter your answer"
                                                        />
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
                                            <h6 className="m-0 font-weight-bold text-primary">New Fullname *</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body" id='NewFullnameInvalid'>
                                            <div className="tab-content">
                                                <div className="card-body">
                                                    <div className="form-group">
                                                        <textarea
                                                            className="form-control text-gray-700"
                                                            style={{ height: '40px' }} // This line sets the height to 100px
                                                            id="NewFullname"
                                                            name="NewFullname"
                                                            value={thisInfo.NewFullname}
                                                            onChange={handleNewFullname}
                                                            placeholder="Enter your answer"
                                                        />
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
                                            <h6 className="m-0 font-weight-bold text-primary">Current Civil Status*</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body" id='CurrentCivilInvalid'>
                                            <div>
                                            <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="CurrentCivilStatus"  
                                                        id="CurrentCivilStatus"
                                                        value="1"
                                                        checked={thisInfo.CurrentCivilStatus === '1'} 
                                                        onChange={handleCurrentCivilStatus}
                                                    />
                                                    <label className="form-check-label" htmlFor="homeConfinement">
                                                        Single
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="CurrentCivilStatus"  
                                                        id="CurrentCivilStatus"
                                                        value="2"
                                                        checked={thisInfo.CurrentCivilStatus === '2'}  
                                                        onChange={handleCurrentCivilStatus}
                                                    />
                                                    <label className="form-check-label" htmlFor="hospitalConfinement">
                                                        Married
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="CurrentCivilStatus"  
                                                        id="CurrentCivilStatus"
                                                        value="3"
                                                        checked={thisInfo.CurrentCivilStatus === '3'}  
                                                        onChange={handleCurrentCivilStatus}
                                                    />
                                                    <label className="form-check-label" htmlFor="hospitalConfinement">
                                                        Separated 
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="CurrentCivilStatus"  
                                                        id="CurrentCivilStatus"
                                                        value="4"
                                                        checked={thisInfo.CurrentCivilStatus === '4'}  
                                                        onChange={handleCurrentCivilStatus}
                                                    />
                                                    <label className="form-check-label" htmlFor="hospitalConfinement">
                                                        Divorced 
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="CurrentCivilStatus"  
                                                        id="CurrentCivilStatus"
                                                        value="5"
                                                        checked={thisInfo.CurrentCivilStatus === '5'}  
                                                        onChange={handleCurrentCivilStatus}
                                                    />
                                                    <label className="form-check-label" htmlFor="hospitalConfinement">
                                                        Widowed 
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
                                            <h6 className="m-0 font-weight-bold text-primary">New Civil Status *</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body" id='NewCivilInvalid'>
                                            <div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="NewCivilStatus"  
                                                        id="NewCivilStatus"
                                                        value="1"
                                                        checked={thisInfo.NewCivilStatus === '1'} 
                                                        onChange={handleNewCivilStatus}
                                                    />
                                                    <label className="form-check-label" htmlFor="homeConfinement">
                                                        Single
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="NewCivilStatus"  
                                                        id="NewCivilStatus"
                                                        value="2"
                                                        checked={thisInfo.NewCivilStatus === '2'}  
                                                        onChange={handleNewCivilStatus}
                                                    />
                                                    <label className="form-check-label" htmlFor="hospitalConfinement">
                                                        Married
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="NewCivilStatus"  
                                                        id="NewCivilStatus"
                                                        value="3"
                                                        checked={thisInfo.NewCivilStatus === '3'}  
                                                        onChange={handleNewCivilStatus}
                                                    />
                                                    <label className="form-check-label" htmlFor="hospitalConfinement">
                                                        Separated 
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="NewCivilStatus"  
                                                        id="NewCivilStatus"
                                                        value="4"
                                                        checked={thisInfo.NewCivilStatus === '4'}  
                                                        onChange={handleNewCivilStatus}
                                                    />
                                                    <label className="form-check-label" htmlFor="hospitalConfinement">
                                                        Divorced 
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="NewCivilStatus"  
                                                        id="NewCivilStatus"
                                                        value="5"
                                                        checked={thisInfo.NewCivilStatus === '5'}  
                                                        onChange={handleNewCivilStatus}
                                                    />
                                                    <label className="form-check-label" htmlFor="hospitalConfinement">
                                                        Widowed 
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
                                            <h6 className="m-0 font-weight-bold text-primary">Marriage Certificate/Contract OR Marriage Certificate with Proper Annotation(Separated/Annulled) (Non-anonymous question) *</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body" id='OtherContractInvalid'>
                                            <div className="">
                                                <div className="">
                                                    <input id='OtherContract' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={handleOtherContract} />
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

export default UpdateEmployee;