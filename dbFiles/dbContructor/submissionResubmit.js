class submissionResubmit{
    constructor(requirementName,FileName,ContentType,Filesize,UploadDate, Resubmit,ResubmitReason,SubmissionID,PdfFileID ){
        this.requirementName = requirementName;
        this.FileName = FileName;
        this.ContentType = ContentType;
        this.Filesize = Filesize;
        this.UploadDate = UploadDate;
        this.Resubmit = Resubmit;
        this.ResubmitReason = ResubmitReason;
        this.SubmissionID = SubmissionID;
        this.PdfFileID = PdfFileID;
    }
}
module.exports = submissionResubmit;