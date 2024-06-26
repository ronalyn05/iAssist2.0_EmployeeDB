// dbOperation.js
const config = require('./dbConfig');
const sql = require('mssql');
const fs = require('fs'); 
const path = require('path');

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

const getSubmissions = async () => {
    try {
        let pool = await sql.connect(config);

        // Query the database to get the PDF data based on the ID
        let result = await pool.request() 
            .query(`
                SELECT 
                    Employee.Name,
                    Submission.SubmissionID,
                    Submission.TransactionType,
                    Submission.TurnAround,
                    Submission.Status,
                    Submission.DateTime,
                    Submission.LoanAppDate,
                    Submission.TransactionNum,
                    Submission.TypeOfDelivery
                FROM Submission
                LEFT JOIN Employee ON Submission.EmpId = Employee.EmpId 
            `);

        // If there's no result, return null
        if (result.recordset.length === 0) {
            return null;
        } 
    
        return result.recordset;

    } catch (error) {
        console.error("Error retrieving PDF data:", error);
        throw error;
    }
}

const getUserSubmissions = async (id) => {
    try {
        let pool = await sql.connect(config);

        // Query the database to get the PDF data based on the ID
        let result = await pool.request() 
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    Employee.Name,
                    Submission.SubmissionID,
                    Submission.TransactionType,
                    Submission.TurnAround,
                    Submission.Status,
                    Submission.DateTime,
                    Submission.LoanAppDate,
                    Submission.TransactionNum,
                    Submission.TypeOfDelivery
                FROM Submission
                LEFT JOIN Employee ON Submission.EmpId = Employee.EmpId 
                Where Submission.EmpId = @id
            `);

        // If there's no result, return null
        if (result.recordset.length === 0) {
            return null;
        } 
    
        return result.recordset;

    } catch (error) {
        console.error("Error retrieving PDF data:", error);
        throw error;
    }
}

const getPDF = async (id) => {
    try {
        let pool = await sql.connect(config);

        // Query the database to get the PDF data based on the ID
        let result = await pool.request() 
            .input('id', sql.Int, id)
            .query(`
                SELECT *
                FROM PdfFile
                WHERE SubmissionID = @id
            `);

        // If there's no result, return null
        if (result.recordset.length === 0) {
            return null;
        } 
        // console.log(result.recordset)
        return result.recordset;
    } catch (error) {
        console.error("Error retrieving PDF data:", error);
        throw error;
    }
}
 
const updateResubmit = async(data,dataPDF) => {
    try {
        // Assuming you have already initialized SQL connection pool
        let pool = await sql.connect(config);

        const EmpResubmitted = "1";
        const status = "Resubmitted"
        
        const file = await pool.request()

        .input('EmpResubmitted', EmpResubmitted) 
        .input('status', status) 
        .input('SubmissionID', data.SubmissionID) 
        .query(`
            UPDATE Submission SET Status = @status WHERE SubmissionID = @SubmissionID;  
            UPDATE PdfFile SET EmpResubmitted = @EmpResubmitted WHERE SubmissionID = @SubmissionID;
        `); 

        InsertResubmitPdf(data,dataPDF);

        console.log("Successfully inserted: ",file);
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}  

//Government Loan -----------------------------------------------------------------------
    const sssLoan = (data, dataPDF) => {
        try {
            const TransactionType = data.TransactionType;
            const Status = data.Status;
            const DateTime = data.currentDate;
            const TurnAround = data.TurnAround;
            const Application_Date = data.Application_Date;
            const Transaction_Num = data.Transaction_Number;
            const RequestType = data.RequestType;
            const TypeOfDelivery = data.TypeOfDelivery;
            const OtherReq = data.OtherReq;
            const EmpId = data.EmpId;
            const ErroneousName = data.ErroneousName;
            const CorrectName = data.CorrectName;
            const RequestTitle = data.RequestTitle;
            const Description = data.Description;
            const CompletionDate= data.CompletionDate;
            const ReasonType = data.ReasonType;
            const DeductionFor = data.DeductionFor;
            const PlaceOfConfinement = data.PlaceOfConfinement;
            const BankAccount = data.BankAccount;
            const ReasonForInfoUpdate = data.ReasonForInfoUpdate;
            const CurrentFullname = data.CurrentFullname; 
            const NewFullname = data.NewFullname;
            const CurrentCivilStatus = data.CurrentCivilStatus;
            const NewCivilStatus = data.NewCivilStatus;
    
            handleDocuments(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus,dataPDF)

            } catch (error) {
                console.error("Error inserting PDF:", error);
                throw error;
            }
        }
    const PagIbigLandbankCard = async (data, dataPDF) => {
        try {
            const TransactionType = data.TransactionType;
            const Status = data.Status;
            const DateTime = data.currentDate;
            const TurnAround = data.TurnAround;
            const Application_Date = data.Application_Date;
            const Transaction_Num = data.Transaction_Number;
            const TypeOfDelivery = data.TypeOfDelivery;
            const RequestType = data.RequestType;
            const OtherReq = data.OtherReq;
            const EmpId = data.EmpId;
            const ErroneousName = data.ErroneousName;
            const CorrectName = data.CorrectName;
            const RequestTitle = data.RequestTitle;
            const Description = data.Description;
            const CompletionDate = data.CompletionDate;
            const DeductionFor = data.DeductionFor;
            const ReasonType = data.ReasonType;
            const PlaceOfConfinement = data.PlaceOfConfinement;
            const BankAccount = data.BankAccount;
            const ReasonForInfoUpdate = data.ReasonForInfoUpdate;
            const CurrentFullname = data.CurrentFullname; 
            const NewFullname = data.NewFullname;
            const CurrentCivilStatus = data.CurrentCivilStatus;
            const NewCivilStatus = data.NewCivilStatus;
    
            handleDocuments(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus,dataPDF)

        } catch (error) {
            console.error("Error inserting PDF:", error);
            throw error;
        }
    }
    const PagIbigVirtualAccount = async (data, dataPDF) => {
        try {
            const TransactionType = data.TransactionType;
            const Status = data.Status;
            const DateTime = data.currentDate;
            const TurnAround = data.TurnAround;
            const Application_Date = data.Application_Date;
            const Transaction_Num = data.Transaction_Number;
            const TypeOfDelivery = data.TypeOfDelivery;
            const RequestType = data.RequestType;
            const OtherReq = data.OtherReq;
            const EmpId = data.EmpId;
            const ErroneousName = data.ErroneousName;
            const CorrectName = data.CorrectName;
            const RequestTitle = data.RequestTitle;
            const Description = data.Description;
            const CompletionDate = data.CompletionDate;
            const DeductionFor = data.DeductionFor;
            const ReasonType = data.ReasonType;
            const PlaceOfConfinement = data.PlaceOfConfinement;
            const BankAccount = data.BankAccount;
            const ReasonForInfoUpdate = data.ReasonForInfoUpdate;
            const CurrentFullname = data.CurrentFullname; 
            const NewFullname = data.NewFullname;
            const CurrentCivilStatus = data.CurrentCivilStatus;
            const NewCivilStatus = data.NewCivilStatus;
    
            handleDocuments(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus,dataPDF)

        } catch (error) {
            console.error("Error inserting PDF:", error);
            throw error;
        }
    }
    const MaternityNotification = async (data, dataPDF) => {
        try {
            const TransactionType = data.TransactionType;
            const Status = data.Status;
            const DateTime = data.currentDate;
            const TurnAround = data.TurnAround;
            const Application_Date = data.Application_Date;
            const Transaction_Num = data.Transaction_Number;
            const TypeOfDelivery = data.TypeOfDelivery;
            const RequestType = data.RequestType;
            const OtherReq = data.OtherReq;
            const EmpId = data.EmpId;
            const ErroneousName = data.ErroneousName;
            const CorrectName = data.CorrectName;
            const RequestTitle = data.RequestTitle;
            const Description = data.Description;
            const CompletionDate = data.CompletionDate;
            const DeductionFor = data.DeductionFor;
            const ReasonType = data.ReasonType;
            const PlaceOfConfinement = data.PlaceOfConfinement;
            const BankAccount = data.BankAccount;
            const ReasonForInfoUpdate = data.ReasonForInfoUpdate;
            const CurrentFullname = data.CurrentFullname; 
            const NewFullname = data.NewFullname;
            const CurrentCivilStatus = data.CurrentCivilStatus;
            const NewCivilStatus = data.NewCivilStatus;
    
            handleDocuments(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus,dataPDF)

        } catch (error) {
            console.error("Error inserting PDF:", error);
            throw error;
        }
    }

const InsertResubmitPdf = async (data,dataPDF) => {
    try {
        let pool = await sql.connect(config);
        
        const pdf = fs.readFileSync(`uploads/${dataPDF.resubmitPDF.filename}`);

        const pdf_base64 = Buffer.from(pdf).toString('base64');

        const file = await pool.request()
        .input('RequirementName', data.requirementName)
        .input('FileName', data.FileName)
        .input('ContentType', data.ContentType)
        .input('Filesize', data.Filesize)
        .input('UploadDate', data.UploadDate)
        .input('Resubmit', data.Resubmit)
        .input('ResubmitReason', data.ResubmitReason)
        .input('SubmissionID', data.SubmissionID)
        .input('pdfData', sql.NVarChar(sql.MAX), pdf_base64)
        .query(`
            INSERT INTO PdfFile (RequirementName, FileName, ContentType, Filesize, UploadDate, Resubmit, ResubmitReason, SubmissionID, pdfData)
            VALUES (@RequirementName, @FileName, @ContentType, @Filesize, @UploadDate, @Resubmit, @ResubmitReason, @SubmissionID, @pdfData)
        `);
  

        console.log("Successfully inserted: ",file);
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}
//--------------------------------------------------------------------------------------------

//Maternity -----------------------------------------------------------------------
const MaternityBenefit = async (data, dataPDF) => {
    try {
        const TransactionType = data.TransactionType;
        const Status = data.Status;
        const DateTime = data.currentDate;
        const TurnAround = data.TurnAround;
        const Application_Date = data.Application_Date;
        const Transaction_Num = data.Transaction_Number;
        const TypeOfDelivery = data.TypeOfDelivery;
        const RequestType = data.RequestType;
        const OtherReq = data.OtherReq;
        const EmpId = data.EmpId;
        const ErroneousName = data.ErroneousName;
        const CorrectName = data.CorrectName;
        const RequestTitle = data.RequestTitle;
        const Description = data.Description;
        const CompletionDate = data.CompletionDate;
        const DeductionFor = data.DeductionFor;
        const ReasonType = data.ReasonType;
        const PlaceOfConfinement = data.PlaceOfConfinement;
        const BankAccount = data.BankAccount;
        const ReasonForInfoUpdate = data.ReasonForInfoUpdate;
        const CurrentFullname = data.CurrentFullname; 
        const NewFullname = data.NewFullname;
        const CurrentCivilStatus = data.CurrentCivilStatus;
        const NewCivilStatus = data.NewCivilStatus;

        handleDocuments(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus,dataPDF)

    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}


//Certificate Request ---------------------------------------------------------
const CertificationRequestSSS = async ( data, dataPDF) => {
    try {
        const TransactionType = data.TransactionType;
        const Status = data.Status;
        const DateTime = data.currentDate;
        const TurnAround = data.TurnAround;
        const Application_Date = data.Application_Date;
        const Transaction_Num = data.Transaction_Number;
        const RequestType = data.RequestType;
        const TypeOfDelivery = data.TypeOfDelivery;
        const OtherReq = data.OtherReq;
        const EmpId = data.EmpId;
        const ErroneousName = data.ErroneousName;
        const CorrectName = data.CorrectName;
        const RequestTitle = data.RequestTitle;
        const Description = data.Description;
        const CompletionDate = data.CompletionDate;
        const DeductionFor = data.DeductionFor;
        const ReasonType = data.ReasonType;
        const PlaceOfConfinement = data.PlaceOfConfinement;
        const BankAccount = data.BankAccount;
        const ReasonForInfoUpdate = data.ReasonForInfoUpdate;
        const CurrentFullname = data.CurrentFullname; 
        const NewFullname = data.NewFullname;
        const CurrentCivilStatus = data.CurrentCivilStatus;
        const NewCivilStatus = data.NewCivilStatus;

        handleDocuments(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus,dataPDF)

    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}

const PHILHEALTHrequest = async (data, dataPDF) => {
    try {
        const TransactionType = data.TransactionType;
        const Status = data.Status;
        const DateTime = data.currentDate;
        const TurnAround = data.TurnAround;
        const Application_Date = data.Application_Date;
        const Transaction_Num = data.Transaction_Number;
        const RequestType = data.RequestType;
        const TypeOfDelivery = data.TypeOfDelivery;
        const OtherReq = data.OtherReq;
        const EmpId = data.EmpId;
        const ErroneousName = data.ErroneousName;
        const CorrectName = data.CorrectName;
        const RequestTitle = data.RequestTitle;
        const Description = data.Description;
        const CompletionDate= data.CompletionDate;
        const ReasonType = data.ReasonType;
        const DeductionFor = data.DeductionFor;
        const PlaceOfConfinement = data.PlaceOfConfinement;
        const BankAccount = data.BankAccount;
        const ReasonForInfoUpdate = data.ReasonForInfoUpdate;
        const CurrentFullname = data.CurrentFullname; 
        const NewFullname = data.NewFullname;
        const CurrentCivilStatus = data.CurrentCivilStatus;
        const NewCivilStatus = data.NewCivilStatus;

        handleDocuments(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus,dataPDF)

    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}

const CertificateOfRemittance = async (data, dataPDF) => {
    try {
        const TransactionType = data.TransactionType;
        const Status = data.Status;
        const DateTime = data.currentDate;
        const TurnAround = data.TurnAround;
        const Application_Date = data.Application_Date;
        const Transaction_Num = data.Transaction_Number;
        const RequestType = data.RequestType;
        const TypeOfDelivery = data.TypeOfDelivery;
        const OtherReq = data.OtherReq;
        const EmpId = data.EmpId;
        const ErroneousName = data.ErroneousName;
        const CorrectName = data.CorrectName;
        const RequestTitle = data.RequestTitle;
        const Description = data.Description;
        const CompletionDate = data.CompletionDate;
        const DeductionFor = data.DeductionFor;
        const ReasonType = data.ReasonType;
        const PlaceOfConfinement = data.PlaceOfConfinement;
        const BankAccount = data.BankAccount;
        const ReasonForInfoUpdate = data.ReasonForInfoUpdate;
        const CurrentFullname = data.CurrentFullname; 
        const NewFullname = data.NewFullname;
        const CurrentCivilStatus = data.CurrentCivilStatus;
        const NewCivilStatus = data.NewCivilStatus;

        handleDocuments(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus,dataPDF)

    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}
const CertificateOfOneness = async (data, dataPDF) => {
    try {
        const TransactionType = data.TransactionType;
        const Status = data.Status;
        const DateTime = data.currentDate;
        const TurnAround = data.TurnAround;
        const Application_Date = data.Application_Date;
        const Transaction_Num = data.Transaction_Number;
        const RequestType = data.RequestType;
        const TypeOfDelivery = data.TypeOfDelivery;
        const OtherReq = data.OtherReq;
        const EmpId = data.EmpId;
        const ErroneousName = data.ErroneousName;
        const CorrectName = data.CorrectName;
        const RequestTitle = data.RequestTitle;
        const Description = data.Description;
        const CompletionDate = data.CompletionDate;
        const DeductionFor = data.DeductionFor;
        const ReasonType = data.ReasonType;
        const PlaceOfConfinement = data.PlaceOfConfinement;
        const BankAccount = data.BankAccount;
        const ReasonForInfoUpdate = data.ReasonForInfoUpdate;
        const CurrentFullname = data.CurrentFullname; 
        const NewFullname = data.NewFullname;
        const CurrentCivilStatus = data.CurrentCivilStatus;
        const NewCivilStatus = data.NewCivilStatus;

        handleDocuments(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus,dataPDF)

    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}
//---------------------------------------------------------------------------------------------------
const SicknessNotification = async (data,dataPDF) => {
    try {

        const TransactionType = data.TransactionType;
        const Status = data.Status;
        const DateTime = data.currentDate;
        const TurnAround = data.TurnAround;
        const Application_Date = data.Application_Date;
        const Transaction_Num = data.Transaction_Number;
        const RequestType = data.RequestType;
        const TypeOfDelivery = data.TypeOfDelivery;
        const OtherReq = data.OtherReq;
        const EmpId = data.EmpId;
        const ErroneousName = data.ErroneousName;
        const CorrectName = data.CorrectName;
        const RequestTitle = data.RequestTitle;
        const Description = data.Description;
        const CompletionDate= data.CompletionDate;
        const ReasonType = data.ReasonType;
        const DeductionFor = data.DeductionFor;
        const PlaceOfConfinement = data.PlaceOfConfinement;
        const BankAccount = data.BankAccount;
        const ReasonForInfoUpdate = data.ReasonForInfoUpdate;
        const CurrentFullname = data.CurrentFullname; 
        const NewFullname = data.NewFullname;
        const CurrentCivilStatus = data.CurrentCivilStatus;
        const NewCivilStatus = data.NewCivilStatus;

        handleDocuments(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus,dataPDF)

    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}
const SicknessApproval = async (data,dataPDF) => {
    try {
        const TransactionType = data.TransactionType;
        const Status = data.Status;
        const DateTime = data.currentDate;
        const TurnAround = data.TurnAround;
        const Application_Date = data.Application_Date;
        const Transaction_Num = data.Transaction_Number;
        const RequestType = data.RequestType;
        const TypeOfDelivery = data.TypeOfDelivery;
        const OtherReq = data.OtherReq;
        const EmpId = data.EmpId;
        const ErroneousName = data.ErroneousName;
        const CorrectName = data.CorrectName;
        const RequestTitle = data.RequestTitle;
        const Description = data.Description;
        const CompletionDate= data.CompletionDate;
        const ReasonType = data.ReasonType;
        const DeductionFor = data.DeductionFor;
        const PlaceOfConfinement = data.PlaceOfConfinement;
        const BankAccount = data.BankAccount;
        const ReasonForInfoUpdate = data.ReasonForInfoUpdate;
        const CurrentFullname = data.CurrentFullname; 
        const NewFullname = data.NewFullname;
        const CurrentCivilStatus = data.CurrentCivilStatus;
        const NewCivilStatus = data.NewCivilStatus;

        handleDocuments(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus,dataPDF)

    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}
const UpdateEmployeeInformation = async (data,dataPDF) => {
    try {
        const TransactionType = data.TransactionType;
        const Status = data.Status;
        const DateTime = data.currentDate;
        const TurnAround = data.TurnAround;
        const Application_Date = data.Application_Date;
        const Transaction_Num = data.Transaction_Number;
        const RequestType = data.RequestType;
        const TypeOfDelivery = data.TypeOfDelivery;
        const OtherReq = data.OtherReq;
        const EmpId = data.EmpId;
        const ErroneousName = data.ErroneousName;
        const CorrectName = data.CorrectName;
        const RequestTitle = data.RequestTitle;
        const Description = data.Description;
        const CompletionDate= data.CompletionDate;
        const ReasonType = data.ReasonType;
        const DeductionFor = data.DeductionFor;
        const PlaceOfConfinement = data.PlaceOfConfinement;
        const BankAccount = data.BankAccount;
        const ReasonForInfoUpdate = data.ReasonForInfoUpdate;
        const CurrentFullname = data.CurrentFullname; 
        const NewFullname = data.NewFullname;
        const CurrentCivilStatus = data.CurrentCivilStatus;
        const NewCivilStatus = data.NewCivilStatus;

        handleDocuments(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus,dataPDF)
       
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}

const OtherRequest = async (data,dataPDF) => {
    try {
        const TransactionType = data.TransactionType;
        const Status = data.Status;
        const DateTime = data.currentDate;
        const TurnAround = data.TurnAround;
        const Application_Date = data.Application_Date;
        const Transaction_Num = data.Transaction_Number;
        const RequestType = data.RequestType;
        const TypeOfDelivery = data.TypeOfDelivery;
        const OtherReq = data.OtherReq;
        const EmpId = data.EmpId;
        const ErroneousName = data.ErroneousName;
        const CorrectName = data.CorrectName;
        const RequestTitle = data.RequestTitle;
        const Description = data.Description;
        const CompletionDate= data.CompletionDate;
        const ReasonType = data.ReasonType;
        const DeductionFor = data.DeductionFor;
        const PlaceOfConfinement = data.PlaceOfConfinement;
        const BankAccount = data.BankAccount;
        const ReasonForInfoUpdate = data.ReasonForInfoUpdate;
        const CurrentFullname = data.CurrentFullname; 
        const NewFullname = data.NewFullname;
        const CurrentCivilStatus = data.CurrentCivilStatus;
        const NewCivilStatus = data.NewCivilStatus;

        if (dataPDF !== ""){
            handleDocuments(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus,dataPDF)
        }else{
            handleDocuments(TransactionType,Status,DateTime,TurnAround,Application_Date,Transaction_Num,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,DeductionFor,ReasonType,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus)
        }


    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}


//------------------------------------------------------------------------
const UpdateRequest = async (Action, SubmissionId) => {
    try {
        let pool = await sql.connect(config);

        let file = await pool.request()
            .input('Status', Action)
            .input('SubmissionID', SubmissionId)
            .query(`
                UPDATE Submission
                SET Status = @Status
                WHERE SubmissionID = @SubmissionID
            `); 

        console.log("Successfully updated: ", file);
    } catch (error) {
        console.error("Error updating record:", error);
        throw error;
    }
}

//------------------------------------------------------------------------




//-----------------------------------------------------------------------
const handleDocuments = async (TransactionType, Status, DateTime, TurnAround, Application_Date, Transaction_Num, RequestType, TypeOfDelivery, OtherReq, EmpId, ErroneousName, CorrectName, RequestTitle, Description, CompletionDate,DeductionFor,ReasonType,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus,dataPDF) => {
    try {
        let pool = await sql.connect(config);
        

        const file = await pool.request()
            .input('TransactionType', TransactionType)
            .input('Status', Status)
            .input('DateTime', DateTime)
            .input('TurnAround', TurnAround)
            .input('Application_Date', Application_Date)
            .input('Transaction_Num', Transaction_Num)
            .input('RequestType', RequestType)
            .input('DeliveryType', TypeOfDelivery)
            .input('OtherReq', OtherReq)
            .input('EmpId', EmpId) 
            .input('ErroneousName', ErroneousName) 
            .input('CorrectName', CorrectName) 
            .input('RequestTitle', RequestTitle) 
            .input('Description', Description)
            .input('CompletionDate', CompletionDate)
            .input('DeductionFor', DeductionFor)
            .input('ReasonType', ReasonType)
            .input('PlaceOfConfinement', PlaceOfConfinement)
            .input('BankAccount', BankAccount)
            .input('ReasonForInfoUpdate', ReasonForInfoUpdate)
            .input('CurrentFullname', CurrentFullname)
            .input('NewFullname', NewFullname)
            .input('CurrentCivilStatus', CurrentCivilStatus)
            .input('NewCivilStatus', NewCivilStatus)
            .query(`
                    INSERT INTO Submission (TransactionType,Status,DateTime,TurnAround,LoanAppDate,TransactionNum,TypeOfDelivery,RequestType,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle,Description,CompletionDate,DeductionFor,ReasonType, PlaceOfConfinement, BankAccNumber, ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus)
                    OUTPUT inserted.SubmissionID
                    VALUES (@TransactionType,@Status,@DateTime,@TurnAround,@Application_Date,@Transaction_Num,@DeliveryType,@RequestType,@OtherReq,@EmpId,@ErroneousName,@CorrectName,@RequestTitle,@Description,@CompletionDate,@DeductionFor,@ReasonType, @PlaceOfConfinement, @BankAccount, @ReasonForInfoUpdate, @CurrentFullname, @NewFullname, @CurrentCivilStatus, @NewCivilStatus)
            `);

            const SubmissionID = file.recordset[0].SubmissionID;
            if (dataPDF.DocumentFile && dataPDF.DocumentFile.length > 0 || dataPDF.Doc1 && dataPDF.Doc1.length > 0 || dataPDF.Doc2 && dataPDF.Doc2.length > 0 || dataPDF.Doc3 && dataPDF.Doc3.length > 0 || dataPDF.Doc4 && dataPDF.Doc4.length > 0 ){
                if(TransactionType === "SSS Loan"){
                    PdfFile(dataPDF.Doc1,SubmissionID,"1 Month Pay Slip");
                    PdfFile(dataPDF.Doc2,SubmissionID,"Loan Disclosure Statement");
                }else if(TransactionType === "Pag-Ibig Landbank Card"){
                    PdfFile(dataPDF.Doc1,SubmissionID,"Application Form");
                    PdfFile(dataPDF.Doc2,SubmissionID,"1 Month Pay Slip");
                    PdfFile(dataPDF.Doc3,SubmissionID,"Valid ID");
                }else if(TransactionType === "Pag-Ibig Virtual Account"){
                    PdfFile(dataPDF.Doc1,SubmissionID,"Screenshot of Filed Loan via Virtual Account");
                    PdfFile(dataPDF.Doc2,SubmissionID,"1 Month Pay Slip");
                    PdfFile(dataPDF.Doc3,SubmissionID,"1 Month Gross Income");
                }else if(TransactionType === "Maternity Notication"){
                    PdfFile(dataPDF.Doc1,SubmissionID,"SSS Maternity Notification Form");
                    PdfFile(dataPDF.Doc2,SubmissionID,"Screenshot of SSS Maternity Eligibility");
                    PdfFile(dataPDF.Doc3,SubmissionID,"SSS Allocation of Maternity Leave Credit Form");
                    PdfFile(dataPDF.Doc4,SubmissionID,"Medical Certificate or Ultrasound Report");
                }else if(TypeOfDelivery === "Live Child Birth"){
                    PdfFile(dataPDF.Doc1,SubmissionID,"Application Form");
                    PdfFile(dataPDF.Doc2,SubmissionID,"Live Birth Certificate");
                    PdfFile(dataPDF.Doc3,SubmissionID,"Solo Parent ID");
                }else if(TypeOfDelivery === "Miscarriage / Emergency Termination of Pregnancy / Ectopic Pregnancy"){
                    PdfFile(dataPDF.Doc1,SubmissionID,"Application Form");
                    PdfFile(dataPDF.Doc2,SubmissionID,"Proof of Pregnancy");
                    PdfFile(dataPDF.Doc3,SubmissionID,"Proof of Termination of Pregnancy");
                }else if(TypeOfDelivery === "Still Birth / Fetal Death"){
                    PdfFile(dataPDF.Doc1,SubmissionID,"Application Form");
                    PdfFile(dataPDF.Doc2,SubmissionID,"Fetal Certificate of Death");
                }else if(RequestType === "SSS Unposted Loan Payment"){
                    PdfFile(dataPDF.Doc1,SubmissionID,"Latest Statement of Account");
                    PdfFile(dataPDF.Doc2,SubmissionID,"Request/Verification Form");
                }else if(RequestType === "SSS Unposted Contribution"){
                    PdfFile(dataPDF.Doc1,SubmissionID,"Latest Monthly Contributions");
                    PdfFile(dataPDF.Doc2,SubmissionID,"Request/Verification Form");
                }else if(RequestType === "SSS Other Information Update Request"){
                    PdfFile(dataPDF.DocumentFile,SubmissionID,"Request/Verification Form");
                }else if(RequestType === "PAG-IBIG Certificate of Remittance"){
                    PdfFile(dataPDF.DocumentFile,SubmissionID,"Latest Statement of Account");
                }else if(RequestType === "PAG-IBIG Certificate of Oneness"){
                    PdfFile(dataPDF.DocumentFile,SubmissionID,"Form from Pag-Ibig");
                }else if(DeductionFor === "SSS Salary Loan" || DeductionFor === "SSS Calamity Loan"){
                    PdfFile(dataPDF.DocumentFile,SubmissionID,"Email Notification from SSS");
                }else if(DeductionFor === "PAG-IBIG Salary Loan" || DeductionFor === "PAG-IBIG Calamity Loan"){
                    if(ReasonType === "Provident Fund"){
                        PdfFile(dataPDF.DocumentFile,SubmissionID,"Provident Application Form received by PAG-IBIG");
                    }else if(ReasonType === "Re-Loan"){
                        PdfFile(dataPDF.DocumentFile,SubmissionID,"Screenshot/Image of Text Notification from PAG-IBIG");
                    }
                }else if(TransactionType === "SSS Sickness Notification"){
                    PdfFile(dataPDF.Doc1,SubmissionID,"Sickness Notification Form");
                    PdfFile(dataPDF.Doc2,SubmissionID,"Medical Certificate");
                    PdfFile(dataPDF.Doc3,SubmissionID,"Supporting Documents");
                    PdfFile(dataPDF.Doc4,SubmissionID,"EC Supporting Documents");
                }else if(TransactionType === "SSS Sickness Approval"){
                    PdfFile(dataPDF.DocumentFile,SubmissionID,"Sickness Eligibility");
                }else if(TransactionType === "Update Employee Information"){
                    PdfFile(dataPDF.Doc1,SubmissionID,"Signed Letter of Request");
                    PdfFile(dataPDF.Doc2,SubmissionID,"Certificate/Contract");
                }
                else if(TransactionType === "Other Request"){
                    PdfFile(dataPDF.DocumentFile,SubmissionID,"Other Request Uploaded File");
                }
            }
            console.log("Successfully inserted: ",file);
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}

const PdfFile = async (insertPDF,SubmissionID,RequirementName) => {
    try {
        const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

        let pool = await sql.connect(config);

        const thisRequirementName = RequirementName;
        const Filename = insertPDF[0].originalname;
        const ContentType = path.extname(Filename).toLowerCase();
        const Size = insertPDF[0].size;
        const UploadDate = currentDate;

        const pdf = fs.readFileSync(`uploads/${insertPDF[0].filename}`);

        const pdf_base64 = Buffer.from(pdf).toString('base64');

        const Resubmit = "0";
        const ResubmitReason = "";
        const thisSubmissionID = SubmissionID;

        let file = await pool.request()
            .input('RequirementName', thisRequirementName)
            .input('Filename', Filename)
            .input('ContentType', ContentType)
            .input('Size', Size)
            .input('UploadDate', UploadDate)
            .input('pdfData', sql.NVarChar(sql.MAX), pdf_base64)  
            .input('Resubmit',Resubmit)
            .input('ResubmitReason',ResubmitReason)
            .input('SubmissionID',thisSubmissionID)
            .query(`
                INSERT INTO PdfFile (RequirementName,FileName,ContentType,FileSize,UploadDate, PdfData, Resubmit,ResubmitReason,SubmissionID)
                VALUES (@RequirementName,@Filename,@ContentType,@Size,@UploadDate,@pdfData,@Resubmit,@ResubmitReason,@SubmissionID)
            `); 

        console.log("Successfully inserted: ",file);
    } catch (error) {
        console.error("Error inserting PDF:", error);
        throw error;
    }
}

const UpdateLink = async (updatethisLabel, updatethisLink) => {
    try {

        let pool = await sql.connect(config);
        
        let file = await pool.request()
            .input('updatethisLabel', sql.VarChar, updatethisLabel)
            .input('updatethisLink', sql.VarChar, updatethisLink)
            .query(`
                UPDATE Link
                SET LinkURL = @updatethisLink
                WHERE LinkName = @updatethisLabel
            `);

        console.log("Successfully updated: ", file);
    } catch (error) {
        console.error("Error updating record:", error);
        throw error;
    }
}
const LinkURL = async (LinkUrl) => {
    try {
        let pool = await sql.connect(config);

        let result = await pool.request()
            .input('LinkUrl', sql.NVarChar, LinkUrl)
            .query(`
                SELECT LinkURL FROM Link WHERE LinkName = @LinkUrl;
            `);

        // If there's no result, return null
        if (result.recordset.length === 0) {
            return null;
        }

        // Return the first record's LinkURL
        return result.recordset[0].LinkURL;
    } catch (error) {
        console.error("Error updating record:", error);
        throw error;
    }
};

const setLink = async () => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .query(`
                SELECT LinkName, LinkURL FROM Link;
            `);

        if (result.recordset.length === 0) {
            return null;
        }
        return result.recordset;
    } catch (error) {
        console.error("Error fetching records:", error);
        throw error;
    }
};

// -----------------------------------------------------------------------
module.exports = {
    insertPDF,
    getSubmissions,
    getUserSubmissions,
    getPDF,
    updateResubmit,
    sssLoan,
    PagIbigLandbankCard,
    PagIbigVirtualAccount,
    MaternityNotification,
    MaternityBenefit,
    CertificationRequestSSS,
    PHILHEALTHrequest,
    CertificateOfRemittance,
    CertificateOfOneness,
    SicknessNotification,
    SicknessApproval,
    OtherRequest,
    UpdateRequest,
    LinkURL,
    setLink,
    UpdateLink,
    UpdateEmployeeInformation
};