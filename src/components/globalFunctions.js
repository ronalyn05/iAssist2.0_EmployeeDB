// global.js

import emailjs from '@emailjs/browser'; 

// Define your functions
export async function notification2() { 

  const formData = new FormData(); 
  // formData.append('pageNumber', pageNumber);
  // formData.append('pageSize', pageSize);
   
  try {
    const uploadResponse = await fetch('http://localhost:5000/getnotification', {
      method: 'POST',
      body: formData
    }) 

    if (!uploadResponse.ok) {
      console.error('Failed:', uploadResponse.statusText);
      return;
    } 

    try {
      const data = await uploadResponse.json();  
      // console.log('this array -',data.result); 
      // setNotification(data.result) 
      // setTotalPages(Math.ceil(data.result.count / pageSize))  
    } catch (error) {
        console.error('Error parsing JSON response:', error);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}


export async function notificationMarkAllRead(id){
    

  const formData = new FormData(); 
  formData.append('EmpId', id); 
    
  try {
    const uploadResponse = await fetch('http://localhost:5000/notificationmarkallread', {
      method: 'POST',
      body: formData
    }) 

    if (!uploadResponse.ok) {
      console.error('Failed:', uploadResponse.statusText);
      return;
    } 

    try {
      const data = await uploadResponse.json();    
      // setTotalPages(Math.ceil(data.result.count / pageSize))  
    } catch (error) {
        console.error('Error parsing JSON response:', error);
    }

  } catch (error) {
    console.error('Error:', error);
  }
};

export async function setNotificationAsRead(NotificationID){
    

  const formData = new FormData(); 
  formData.append('NotificationID', NotificationID); 
    
  try {
    const uploadResponse = await fetch('http://localhost:5000/setnotificationasread', {
      method: 'POST',
      body: formData
    }) 

    if (!uploadResponse.ok) {
      console.error('Failed:', uploadResponse.statusText);
      return;
    } 

    try {
      const data = await uploadResponse.json();     
    } catch (error) {
        console.error('Error parsing JSON response:', error);
    }

  } catch (error) {
    console.error('Error:', error);
  }
};

//insert notification
export async function insertNotification(Name, TransactionType, SenderID, ReceiverID, notificationType, SubmissionID){ 

  const formData = new FormData();
  formData.append('EmployeeName', Name);  
  formData.append('TransactionType', TransactionType);  
  formData.append('SenderID', SenderID);  
  formData.append('ReceiverID', ReceiverID);  
  formData.append('NotificationType', notificationType);  
  formData.append('SubmissionID', SubmissionID);   
  try {
    const uploadResponse = await fetch('http://localhost:5000/insertnotification', {
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


    // Function to handle form submission
  export async function  sendEmail (type, data) {  
    
    /*
    3 days
    loan application certification
    sss sickness notification
    sss maternity notification
    sss maternity reimbursement
    stop deduction
    general

    5 days
    certification request     
    */
    
    let HrName
    let HrEmail
    let cc
    const TurnAround = /Certification Request/i.test(data.TransactionType) ? 'five (5)': 'three (3)';

    
    const formData = new FormData();
    formData.append('facility', data.facility);
    
    try {
      const uploadResponse = await fetch('http://localhost:5000/gethremails', {
        method: 'POST',
        body: formData,
      });
   
      if (!uploadResponse.ok) {
        console.error('Failed to upload PDF:', uploadResponse.statusText);
        return;
      }

      try {
        const pdfResponse = await uploadResponse.json(); 
        HrName = pdfResponse.result[0].Name
        HrEmail = pdfResponse.result[0].EmailAddress
        
        cc = pdfResponse.result.map(item => item.EmailAddress).join(', '); 
        
      } catch (error) {
          console.error('Error parsing JSON response:', error);
      }
   
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }

    const content = {
      sender_name: HrName,
      sender_email: HrEmail, // hr's email
      receiver_name: data.Name,
      receiver_email: data.EmailAddress, // employee's email
      transaction_type: data.TransactionType,
      document_name: data.documentName,
      reason: data.reason,
      stopDeduction: data.stopDeduction,
      cc: cc,
      turnAround: TurnAround
    };  
    // console.log(content);
 
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

export async function sendEmailjs (emailType, data) {  

  let message = ''
  let title = ''
  let cc = ''

  if(data.cc){
    cc = data.cc
  } else {
    cc = data.receiver_email + ", "+ data.sender_email
  }

  // complete - message for transaction completion
  const titleComplete = `${data.transaction_type} Approval and Completion Confirmation`
  const messageComplete = `
  Dear ${data.receiver_name},

  I hope this email finds you well.
  
  I am pleased to inform you that the ${data.transaction_type} you submitted has been successfully approved and processed. Your diligent efforts in ensuring its accuracy and completeness are greatly appreciated.
  
  Please review the attached confirmation document for your reference. Should you have any questions or require further assistance, feel free to reach out to me at any time.
  
  Thank you for your prompt attention to this matter.
  
  Best regards,
  
  ${data.sender_name}`


  // submit - message for submitting request
  const titleSubmit = `${data.transaction_type}: ${data.receiver_name}`
  const messageSubmit = `
  Your request for ${data.transaction_type} has been received. 

  Your HR CompBen Team will review the submitted documents and will email you within ${data.turnAround} working days to update you on the status of your request
   
  If no update is received within the speciefied timeline, you may send us an email at HRComp_Ben@innodata.com.

  Thank you.

  HR Compensation & Benefits Team
  `

  // submit - message for submitting request
  const titleStopDeduction = `Request to Stop Deduction : ${data.receiver_name}`
  const messageStopDeduction = `
  Your request to stop deduction for your ${data.transaction_type} due to ${data.reason} is received. 

  Your HR CompBen Team will review the submitted documents and will email you within three (3) working days to update you on the status of your request
   
  If no update is received within the speciefied timeline, you may send us an email at HRComp_Ben@innodata.com.

  Thank you.

  HR Compensation & Benefits Team
  `
 
  // resubmit - message for resubmission of file
  const titleResubmit = `Action Required: Resubmission of Document for ${data.transaction_type}`
  const messageResubmit = `
  Dear ${data.receiver_name},

  I hope this email finds you well. 
  
  We would like to bring to your attention that there is a requirement for resubmission of a document related to the ${data.transaction_type} you initiated. It appears that the ${data.document_name} submitted did not meet the necessary criteria.
  
  To ensure the completion of the transaction process, we kindly request you to resubmit the ${data.document_name} at your earliest convenience. The reason for resubmission is ${data.reason}.
  
  Your prompt attention to this matter will greatly assist us in finalizing the transaction smoothly.
  
  If you require any assistance or clarification regarding the resubmission process, please do not hesitate to reach out to HR Compensation & Benefits Team.
  
  Thank you for your cooperation and understanding.
  
  
  
  Best regards,

  ${data.sender_name} `
  
  // message for resubmitting of file by the employee
  const titleResubmitted = `Notification: ${data.employee_name} Resubmitted Document for ${data.transaction_type}`
  const messageResubmitted = `
  Dear ${data.hr_name},

  This is to inform you that ${data.employee_name} has resubmitted the ${data.document_name} required for the ${data.transaction_type} process.

  Please review the resubmitted document at your earliest convenience. If any further action is required, you will be notified promptly.

  Thank you for your attention to this matter.

  Best regards,
 
  Automated HR Information System`
  
  // message for transaction expiration
  const titleExpired = `test ${data}`
  const messageExpired = `test ${data}`

  switch(emailType){
    case 'complete':
      title = titleComplete
      message = messageComplete
      break;
    case 'resubmit':
      title = titleResubmit
      message = messageResubmit
      break;    
    case 'resubmitted':
      title = titleResubmit
      message = messageResubmit
      break;      
    case 'submit': 
      if(data.stopDeduction){
        title = titleStopDeduction
        message = messageStopDeduction
      }else{
        title = titleSubmit
        message = messageSubmit
      }
      break;      
  }

  return new Promise((resolve, reject) => {
    //email content
    const formData = {
      sender_name: data.sender_name,
      sender_email: data.sender_email, 
      receiver_name: data.receiver_name, 
      receiver_email: data.receiver_email, 
      message: message,  
      title: title,
      cc: cc
    };   
    console.log(formData );

    emailjs.send('service_2cen06m', 'template_complete', formData, 'hrQ_V5JOOkQWdddTK')
      .then((result) => {
        console.log('Email sent successfully:', result.text);
        // alert('Updated Successfully') 
        resolve(true);
      }, (error) => {
        console.error('Email sending failed:', error.text);
        reject(error);
      });
  });
};

export function add(a, b) {
  return a + b;
}
