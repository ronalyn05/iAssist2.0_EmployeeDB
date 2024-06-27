// dbOperation.js
const config = require('./dbConfig');
const sql = require('mssql');
const fs = require('fs'); 

const insertPDF = async (filename) => {
    try {
        console.log('1')
        let pool = await sql.connect(config);

        // Read the file from the uploads directory
        const fileData = fs.readFileSync(`uploads/${filename}`);

        // Convert binary data to Base64 string
        const base64Data = Buffer.from(fileData).toString('base64');
        
        console.log('2')

        let file = await pool.request()
            .input('pdf', sql.NVarChar(sql.MAX), base64Data) 
            .query(`
                INSERT INTO SSS (Pay_Slip)
                VALUES (@pdf)
            `); 

        console.log(file);
    } catch (error) {
        console.error("Error updating employee attendance:", error);
        throw error;
    }
}
 

// EmpPersonalDetails side - get employee's submissions
const getUserSubmissions = async (id, pageNumber, pageSize) => {
    try { 
      let pool = await sql.connect(config);
      let result = await pool.request()
        .input('id', sql.VarChar, id)
        .input('PageNumber', sql.Int, pageNumber)
        .input('PageSize', sql.Int, pageSize) 
        .query(`SELECT 
                    SubsWithRowNumber.* 
                FROM (
                    SELECT 
                        EmpPersonalDetails.EmployeeName,
                        EmpPersonalDetails.EmailAddress,
                        Submission.*,
                        ROW_NUMBER() OVER (ORDER BY SubmissionID DESC) AS RowNumber
                    FROM Submission
                    LEFT JOIN EmpPersonalDetails ON Submission.EmpId = EmpPersonalDetails.EmployeeId 
                    WHERE Submission.EmpId = @id
                ) AS SubsWithRowNumber
                WHERE SubsWithRowNumber.RowNumber BETWEEN (@PageNumber - 1) * @PageSize + 1 AND @PageNumber * @PageSize 
        `); 
        
        let count = await pool.request() 
            .input('id', sql.VarChar, id)
            .query(`
                SELECT COUNT(*) FROM Submission
                WHERE EmpId = @id;
            `);
        if (result.recordset.length === 0) {
            return null;
        }
        //   return result.recordset;
        return { count: count.recordset[0][''], submissions: result.recordset };
    } catch (error) {
      console.error("Error retrieving submission data:", error);
      throw error;
    }
}
// EmpPersonalDetails side - get hr emails
const getHREmails = async (facility) => {
    try { 
      let pool = await sql.connect(config);
      let result = await pool.request()
        .input('facility', sql.VarChar, facility) 
        .query(`
            SELECT 
                EmpPersonalDetails.EmployeeName AS Name,
                EmpPersonalDetails.EmailAddress 
            FROM EmpPersonalDetails 
            LEFT JOIN EmployeeInfo ON EmpPersonalDetails.EmployeeId = EmployeeInfo.EmployeeId 
            LEFT JOIN UserAccount ON EmpPersonalDetails.EmployeeId = UserAccount.EmployeeId 
            WHERE EmployeeInfo.Facility = @facility AND UserAccount.Role = 'HRAdmin'
        `); 
         
        if (result.recordset.length === 0) {
            return null;
        }
        //   return result.recordset;
        return  result.recordset ;
    } catch (error) {
      console.error("Error retrieving submission data:", error);
      throw error;
    }
}


// HR side - get submission pdfs
const getPDF = async (id) => {
    try {
        let pool = await sql.connect(config);
 
        let result = await pool.request() 
            .input('id', sql.Int, id)
            .query(`
                SELECT *
                FROM PdfFile
                WHERE SubmissionID = @id
            `);
 
        if (result.recordset.length === 0) {
            return null;
        }  
        return result.recordset;
    } catch (error) {
        console.error("Error retrieving PDF data:", error);
        throw error;
    }
}
// HR side - update if need resubmission
const updatePDF = async (id,reason,subId) => {
    try {
        let pool = await sql.connect(config);

        
        let result = await pool.request()
            .input('id', sql.Int, id)
            .input('reason', sql.NVarChar(200), reason) // Assuming the reason is a string with a maximum length of 50 characters
            .query(`
                UPDATE PdfFile
                SET ResubmitReason = @reason,
                Resubmit = 1,
                Updated = 1
                WHERE PdfFileID = @id
            `); 
        let submission = await pool.request()
            .input('id', sql.Int, subId) 
            .query(`
                UPDATE Submission
                SET Status = 'Resubmit'
                WHERE SubmissionID = @id
            `);
 
        return "Successfully updated the pdf";
    } catch (error) {
        console.error("Error updating PDF data:", error);
        throw error;
    }
}
// HR side - update if complete
const updateSubmission = async (id) => {
    try {
        let pool = await sql.connect(config);
 
        let result = await pool.request()
            .input('id', sql.Int, id) 
            .query(`
                UPDATE Submission
                SET Status = 'Complete',
                CompletionDate = CONVERT(VARCHAR, GETDATE(), 23)
                WHERE SubmissionID = @id
            `);
 
        return "Successfully updated the pdf";
    } catch (error) {
        console.error("Error updating PDF data:", error);
        throw error;
    }
}
// HR side - get all employee submissions
const getSubmissions = async (pageNumber, pageSize, facility) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool.request()
        .input('PageNumber', sql.Int, pageNumber)
        .input('PageSize', sql.Int, pageSize) 
        .input('Facility', sql.VarChar, facility) 
        .query(`SELECT 
                    SubsWithRowNumber.* 
                FROM (
                    SELECT 
                    EmpPersonalDetails.EmployeeName AS Name,
                    EmpPersonalDetails.EmailAddress,
                    Submission.*,
                        ROW_NUMBER() OVER (ORDER BY SubmissionID DESC) AS RowNumber
                    FROM Submission
                    LEFT JOIN EmpPersonalDetails ON Submission.EmpId = EmpPersonalDetails.EmployeeId 
                    LEFT JOIN EmployeeInfo ON Submission.EmpId = EmployeeInfo.EmployeeId 
                    WHERE EmployeeInfo.Facility = @Facility
                ) AS SubsWithRowNumber
                WHERE SubsWithRowNumber.RowNumber BETWEEN (@PageNumber - 1) * @PageSize + 1 AND @PageNumber * @PageSize 
        `); 
        
        let count = await pool.request() 
            .query(`
                SELECT COUNT(*) FROM Submission;
            `);
        if (result.recordset.length === 0) {
            return null;
        }
        //   return result.recordset;
        return { count: count.recordset[0][''], submissions: result.recordset };
    } catch (error) {
      console.error("Error retrieving submission data:", error);
      throw error;
    }
}
// HR side - get all employee submissions
const getFilteredSubmissions = async (pageNumber, pageSize, facility, name, transactionType, status, month, year) => {
    let query =   `SELECT 
                        SubsWithRowNumber.* 
                    FROM (
                        SELECT 
                            EmpPersonalDetails.EmployeeName AS Name,
                            EmpPersonalDetails.EmailAddress,
                            Submission.*,
                            ROW_NUMBER() OVER (ORDER BY SubmissionID DESC) AS RowNumber
                        FROM Submission
                        LEFT JOIN EmpPersonalDetails ON Submission.EmpId = EmpPersonalDetails.EmployeeId
                        LEFT JOIN EmployeeInfo ON Submission.EmpId = EmployeeInfo.EmployeeId 
                        WHERE EmployeeInfo.Facility = @Facility 
                    `
    let endQuery =   `) AS SubsWithRowNumber
                    WHERE SubsWithRowNumber.RowNumber BETWEEN (@PageNumber - 1) * @PageSize + 1 AND @PageNumber * @PageSize 
                    `
    let countFilter = ` LEFT JOIN EmpPersonalDetails ON Submission.EmpId = EmpPersonalDetails.EmployeeId 
                        LEFT JOIN EmployeeInfo ON Submission.EmpId = EmployeeInfo.EmployeeId 
                        WHERE EmployeeInfo.Facility = @Facility `

    if(name){
        query += ` AND (EmpPersonalDetails.EmployeeName LIKE '%${name}%' OR Submission.EmpId LIKE '%${name}%') `
        countFilter += ` AND (EmpPersonalDetails.EmployeeName LIKE '%${name}%' OR Submission.EmpId LIKE '%${name}%') `
    } 
    if(transactionType){
        query += ` AND Submission.TransactionType = '${transactionType}' `
        countFilter += ` AND TransactionType = '${transactionType}' `
    } 
    if(status){
        query += `AND Submission.Status = '${status}' `
        countFilter += `AND Status = '${status}' `
    }
    if(month){
        const date = year+'-'+month 
        query += `AND Submission.DateTime LIKE '${date}%' `
        countFilter += `AND DateTime LIKE '${date}%' `
    }
    else if(year){ 
        query += `AND Submission.DateTime LIKE '${year}%' `
        countFilter += `AND DateTime LIKE '${year}%' `
    }
    query += endQuery;  
    console.log(name);

    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('PageNumber', sql.Int, pageNumber)
            .input('PageSize', sql.Int, pageSize) 
            .input('Facility', sql.VarChar, facility) 
            .query(query); 
        
        let count = await pool.request() 
            .input('Facility', sql.VarChar, facility) 
            .query(`
                SELECT COUNT(*) FROM Submission
            `+ countFilter);
        if (result.recordset.length === 0) {
            return null;
        }
        //   return result.recordset;
        return { count: count.recordset[0][''], submissions: result.recordset };
    } catch (error) {
      console.error("Error retrieving submission data:", error);
      throw error;
    }
}
// HR side - download submissions
const downloadSubmissions = async (name, transactionType, status, month, year, facility) => {
    console.log(facility);
    let query =   `SELECT 
                        SubsWithRowNumber.EmpId,
                        SubsWithRowNumber.Name,
                        SubsWithRowNumber.EmailAddress,
                        SubsWithRowNumber.TransactionType,
                        FORMAT(CONVERT(DATETIME, SubsWithRowNumber.DateTime, 120), 'MMMM dd, yyyy') AS DateTime,
                        FORMAT(CONVERT(DATETIME, SubsWithRowNumber.CompletionDate, 120), 'MMMM dd, yyyy') AS CompletionDate,
                        SubsWithRowNumber.Status
                    FROM (
                        SELECT  
                            EmpPersonalDetails.EmployeeName AS Name,
                            EmpPersonalDetails.EmailAddress,
                            Submission.*,
                            ROW_NUMBER() OVER (ORDER BY SubmissionID DESC) AS RowNumber
                        FROM Submission
                        LEFT JOIN EmpPersonalDetails ON Submission.EmpId = EmpPersonalDetails.EmployeeId
                        LEFT JOIN EmployeeInfo ON Submission.EmpId = EmployeeInfo.EmployeeId 
                        WHERE EmployeeInfo.Facility = @Facility 
                    `
    let endQuery =   `) AS SubsWithRowNumber`
    let countFilter = ` LEFT JOIN EmpPersonalDetails ON Submission.EmpId = EmpPersonalDetails.EmployeeId 
                        LEFT JOIN EmployeeInfo ON Submission.EmpId = EmployeeInfo.EmployeeId 
                        WHERE EmployeeInfo.Facility = @Facility `

    if(name){
        query += ` AND (EmpPersonalDetails.EmployeeName LIKE '%${name}%' OR Submission.EmpId LIKE '%${name}%') `
        countFilter += ` AND (EmpPersonalDetails.EmployeeName LIKE '%${name}%' OR Submission.EmpId LIKE '%${name}%') `
    } 
    if(transactionType){
        query += ` AND Submission.TransactionType = '${transactionType}' `
        countFilter += ` AND TransactionType = '${transactionType}' `
    } 
    if(status){
        query += `AND Submission.Status = '${status}' `
        countFilter += `AND Status = '${status}' `
    }
    if(month){
        const date = year+'-'+month 
        query += `AND Submission.DateTime LIKE '${date}%' `
        countFilter += `AND DateTime LIKE '${date}%' `
    }
    else if(year){ 
        query += `AND Submission.DateTime LIKE '${year}%' `
        countFilter += `AND DateTime LIKE '${year}%' `
    }
    query += endQuery;  

    try {
        let pool = await sql.connect(config);
        let result = await pool.request() 
            .input('Facility', sql.VarChar, facility)   
            .query(query); 
        
        let count = await pool.request() 
            .input('Facility', sql.VarChar, facility) 
            .query(`
                SELECT COUNT(*) FROM Submission
            `+countFilter);
        if (result.recordset.length === 0) {
            return null;
        }
        //   return result.recordset;
        return { count: count.recordset[0][''], submissions: result.recordset };
    } catch (error) {
      console.error("Error retrieving submission data:", error);
      throw error;
    }
}



// All - get notifications for 'bell'
const getNotifications = async (id) => {
    try {
        let pool = await sql.connect(config); 
        let result = await pool.request() 
            .input('id', sql.VarChar, id)
            .query(`
            SELECT TOP 8 *,
                CASE 
                    WHEN CONVERT(DATE, Timestamp) = CONVERT(DATE, GETDATE()) THEN 'Today'
                    ELSE CONVERT(VARCHAR(20), CONVERT(DATETIME, Timestamp), 107)
                END + ' ' + FORMAT(CONVERT(DATETIME, Timestamp), 'h:mm tt') AS FormattedDateTime
            FROM Notification
            WHERE ReceiverID = @id
            ORDER BY NotificationID DESC;
            `);
 
            // WHERE SubmissionID = @id 
        if (result.recordset.length === 0) {
            return [];
        }  
        return result.recordset;
    } catch (error) {
        console.error("Error retrieving PDF data:", error);
        throw error;
    }
}
// All - get notifications for 'view all'
const getNotificationsForViewAll = async (id, pageNumber, pageSize) => {
    try {
        let pool = await sql.connect(config);  
        let result = await pool.request() 
            .input('id', sql.VarChar, id)
            .input('PageNumber', sql.Int, pageNumber)
            .input('PageSize', sql.Int, pageSize) 
            .query(`
                SELECT 
                    NotifWithRowNumber.NotificationID,
                    NotifWithRowNumber.SenderID,
                    NotifWithRowNumber.ReceiverID,
                    NotifWithRowNumber.Title,
                    NotifWithRowNumber.Message,
                    NotifWithRowNumber.Timestamp,
                    NotifWithRowNumber.IsSeen,
                    NotifWithRowNumber.SubmissionID,
                    NotifWithRowNumber.RowNumber
                FROM (
                    SELECT 
                        Notification.*,
                        ROW_NUMBER() OVER (ORDER BY NotificationID DESC) AS RowNumber
                    FROM Notification
                    WHERE ReceiverID = @id
                ) AS NotifWithRowNumber
                WHERE NotifWithRowNumber.RowNumber BETWEEN (@PageNumber - 1) * @PageSize + 1 AND @PageNumber * @PageSize;
            `);

        let count = await pool.request() 
            .input('id', sql.VarChar, id)
            .query(`
                SELECT COUNT(*) FROM Notification
                WHERE ReceiverID = @id;
            `);
        if (result.recordset.length === 0) {
            return null;
        }
        //   return result.recordset;
        return { count: count.recordset[0][''], notification: result.recordset };
    } catch (error) {
        console.error("Error retrieving PDF data:", error);
        throw error;
    }
}
// All - mark all notifications as read
const markAllNotificationsRead = async (id) => {
    try {
        let pool = await sql.connect(config); 
        console.log(id);
        let result = await pool.request() 
            .input('id', sql.VarChar, id)
            .query(`
                UPDATE Notification
                SET IsSeen = 1
                WHERE ReceiverID = @id;
            `);
  
        if (result.recordset.length === 0) {
            return [];
        }  
        return result.recordset;
    } catch (error) {
        console.error("Error retrieving PDF data:", error);
        throw error;
    }
}
// All - mark 1 notification as read
const setNotificationAsRead = async (id) => {
    try {
        let pool = await sql.connect(config);  
        let result = await pool.request() 
            .input('id', sql.Int, id)
            .query(`
                UPDATE Notification
                SET IsSeen = 1
                WHERE NotificationID = @id;
            `);
  
        if (result.recordset) {
            return null;
        }  
        return result.recordset;
    } catch (error) {
        console.error("Error retrieving PDF data:", error);
        throw error;
    }
}
// All - get submission data for notification
const getSubmissionForNotification = async (SubmissionID) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool.request()
        .input('id', sql.Int, SubmissionID) 
        .query(` 
            SELECT 
                EmpPersonalDetails.EmployeeId,
                EmpPersonalDetails.EmployeeName AS Name,
                EmpPersonalDetails.EmailAddress,
                Submission.* 
            FROM Submission
            LEFT JOIN EmpPersonalDetails ON Submission.EmpId = EmpPersonalDetails.EmployeeId  
            WHERE Submission.SubmissionID = @id;
        `); 
         
        if (result.recordset.length === 0) {
            return null;
        }
        //   return result.recordset;
        return { submissions: result.recordset };
    } catch (error) {
      console.error("Error retrieving submission data:", error);
      throw error;
    }
}
// All - insert new notification
const insertNotification = async ( EmployeeName, TransactionType, SenderID, ReceiverID, NotificationType, SubmissionID) => {
 
    let title
    let message 
    switch(NotificationType){
        case 'complete':
            title = `Your ${TransactionType} has been Successfully Completed`
            message = `Dear ${EmployeeName}, we are pleased to notify you that 
                your ${TransactionType} transaction has been completed successfully. For 
                any further assistance, please reach out to our support team.`
            break
        case 'resubmit':
            title = `Important: Resubmit File for Your ${TransactionType} Transaction`
            message = `Dear ${EmployeeName}, we are pleased to notify you that 
            your ${TransactionType} transaction has been completed successfully. For 
            any further assistance, please reach out to our support team.`
            break
        case 'expired':
            title = `Attention: Your ${TransactionType} Transaction Has Expired`
            message = `Dear ${EmployeeName}, we are writing to inform you that 
            your ${TransactionType} transaction has expired. For assistance with resubmission 
            or further inquiries, please contact our support team.`
            break;
    }
    
    try {
      let pool = await sql.connect(config);
      let result = await pool.request()  
        .input('SenderID', sql.VarChar, SenderID)
        .input('ReceiverID', sql.VarChar, ReceiverID) 
        .input('Title', sql.VarChar, title) 
        .input('Message', sql.VarChar, message) 
        .input('SubmissionID', sql.Int, SubmissionID)
        .query(` 
            INSERT INTO Notification (SenderID, ReceiverID, Title, Message, SubmissionID)
            VALUES (@SenderID, @ReceiverID, @Title, @Message, @SubmissionID);
        `); 
         
        //   return result.recordset;
        return;
    } catch (error) {
      console.error("Error retrieving submission data:", error);
      throw error;
    }
}

const sample = async () => {
    try {
        let pool = await sql.connect(config);

        // Query the database to get the PDF data based on the ID
        let result = await pool.request() 
            .query(`
                SELECT 
                    EmpPersonalDetails.EmployeeName AS Name,
                    EmpPersonalDetails.EmailAddress,
                    Submission.SubmissionID,
                    Submission.TransactionType,
                    Submission.TurnAround,
                    Submission.Status,
                    Submission.DateTime,
                    Submission.LoanAppDate,
                    Submission.TransactionNum,
                    Submission.TypeOfDelivery
                FROM Submission
                LEFT JOIN EmpPersonalDetails ON Submission.EmpId = EmpPersonalDetails.EmployeeId 
            `);

    
        return;

    } catch (error) {
        console.error("Error retrieving PDF data:", error);
        throw error;
    }
}

module.exports = {
    insertPDF,
    getSubmissions,
    getFilteredSubmissions,
    getUserSubmissions, 
    getPDF,
    updatePDF,
    updateSubmission,
    getNotifications,
    getNotificationsForViewAll,
    markAllNotificationsRead,
    setNotificationAsRead,
    getSubmissionForNotification,
    insertNotification,
    downloadSubmissions,
    getHREmails
};