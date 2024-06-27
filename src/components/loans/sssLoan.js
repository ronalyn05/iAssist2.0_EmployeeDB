import React, { useState } from 'react';
import Navbar from '../navbar';
import TopNavbar from '../topnavbar';
import Footer from '../footer';
import '../../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendEmail } from '../globalFunctions'; 

function SSSLoan() {

    const EmployeeId = sessionStorage.getItem("employeeId");

    const [thisInfo, setSSSinfo] = useState({
        Application_Date: '',
        Transaction_Number: '', // Keep it as string for input handling
        Pay_Slip: '',
        Disclosure_Statement: '',
    });

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const isValidFileType = (file) => {
            const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
            return allowedTypes.includes(file.type);
        };

        console.log(EmployeeId);

        // Check if Application_Date is empty
        if (!thisInfo.Application_Date) {
            document.getElementById('loanApplicationDate').style.border = '1px solid red';
            toast.error('Loan Application Date is required.', {
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
        } else {
            document.getElementById('loanApplicationDate').style.border = '';
        }

        const formData = new FormData();
        formData.append('currentEmployeeId', EmployeeId);
        formData.append('Application_Date', thisInfo.Application_Date);

        // Check if Transaction_Number is a valid integer
        if (/^\d+$/.test(thisInfo.Transaction_Number)) {
            formData.append('Transaction_Number', thisInfo.Transaction_Number);
            document.getElementById('TransactionNum').style.border = '';
        } else {
            document.getElementById('TransactionNum').style.border = '1px solid red';
            toast.error('Something went wrong. Please check your Transaction Number input.', {
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
        if (thisInfo.Pay_Slip && isValidFileType(thisInfo.Pay_Slip)) {
            formData.append('Pay_Slip', thisInfo.Pay_Slip);
            document.getElementById('PaySlipInvalid').style.border = '';
        } else {
            document.getElementById('PaySlipInvalid').style.border = '1px solid red';
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

        // Validate and append Disclosure Statement
        if (thisInfo.Disclosure_Statement && isValidFileType(thisInfo.Disclosure_Statement)) {
            formData.append('Disclosure_Statement', thisInfo.Disclosure_Statement);
            document.getElementById('DisclosureStatementInvalid').style.border = '';
        } else {
            document.getElementById('DisclosureStatementInvalid').style.border = '1px solid red';
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
            const response = await fetch('/SSSloan', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const jsonResponse = await response.json();

                console.log(jsonResponse.message);

                setSSSinfo({
                    Application_Date: '',
                    Transaction_Number: '',
                    Pay_Slip: '',
                    Disclosure_Statement: ''
                });

                // Clear file input fields
                document.getElementById('loanApplicationDate').value = null;
                document.getElementById('TransactionNum').value = null;
                document.getElementById('PaySlip').value = null;
                document.getElementById('DisclosureStatement').value = null;

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
    };

    const handlePay_Slip = (e) => {
        setSSSinfo({ ...thisInfo, Pay_Slip: e.target.files[0] });
    };

    const handleDisclosure_Statement = (e) => {
        setSSSinfo({ ...thisInfo, Disclosure_Statement: e.target.files[0] });
    };

    const handleLoanApplicationDateChange = (e) => {
        setSSSinfo({ ...thisInfo, Application_Date: e.target.value });
    };

    const getCurrentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        let month = now.getMonth() + 1;
        let day = now.getDate();

        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }

        return `${year}-${month}-${day}`;
    };
    const SendEmailNotification = () => {
        
        const content = {
            HrName: '',
            HrEmail: '', // hr's email
            Name: sessionStorage.getItem("firstName") + " " + sessionStorage.getItem("lastName"),
            EmailAddress: sessionStorage.getItem("email"), // employee's email
            TransactionType: 'SSS Loan',
            documentName: '',
            reason: '',
            stopDeduction: false,
            facility: sessionStorage.getItem("facility")
        }; 
        
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
                            <h4 className="m-0 font-weight-bold text-primary header-name">SSS Loan</h4>
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
                                            <h6 className="m-0 font-weight-bold text-primary">Loan Details</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body">
                                            <div className="tab-content">
                                                <div className="card-body loan-row">
                                                    <div className="form-group">
                                                        <label>Loan Application Date</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            id="loanApplicationDate"
                                                            name="loanApplicationDate"
                                                            max={getCurrentDate()}
                                                            value={thisInfo.Application_Date}
                                                            onChange={handleLoanApplicationDateChange}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="name">Transaction Number</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="TransactionNum"
                                                            name="name"
                                                            value={thisInfo.Transaction_Number}
                                                            onChange={(e) => setSSSinfo({ ...thisInfo, Transaction_Number: e.target.value })}
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
                                            <h6 className="m-0 font-weight-bold text-primary">1 Month Pay Slip</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body" id='PaySlipInvalid'>
                                            <div className="tab-content">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-left">
                                                        <input
                                                            type="file"
                                                            className="input-file"
                                                            aria-describedby="fileHelp"
                                                            onChange={handlePay_Slip}
                                                            id='PaySlip'
                                                        />
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
                                            <h6 className="m-0 font-weight-bold text-primary">Loan Disclosure Statement</h6>
                                        </div>
                                        {/* Card Body - New Hire Options */}
                                        <div className="card-body" id='DisclosureStatementInvalid'>
                                            <div className="tab-content">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-left">
                                                        <input
                                                            type="file"
                                                            className="input-file"
                                                            aria-describedby="fileHelp"
                                                            onChange={handleDisclosure_Statement}
                                                            id='DisclosureStatement'
                                                        />
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

export default SSSLoan;