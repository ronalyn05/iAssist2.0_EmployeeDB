class thisDefaultContructor{
    constructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle,Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus){
        this.TransactionType = TransactionType;
        this.Status = Status;
        this.currentDate = currentDate;
        this.TurnAround = TurnAround;
        this.Application_Date = Application_Date;
        this.Transaction_Number = Transaction_Number;
        this.RequestType = RequestType;
        this.TypeOfDelivery = TypeOfDelivery;
        this.OtherReq = OtherReq;
        this.EmpId = EmpId;
        this.ErroneousName = ErroneousName;
        this.CorrectName = CorrectName;
        this.RequestTitle = RequestTitle;
        this.Description = Description;
        this.CompletionDate = CompletionDate;
        this.ReasonType = ReasonType;
        this.DeductionFor = DeductionFor;
        this.PlaceOfConfinement = PlaceOfConfinement;
        this.BankAccount = BankAccount;
        this.ReasonForInfoUpdate = ReasonForInfoUpdate;
        this.CurrentFullname = CurrentFullname; 
        this.NewFullname = NewFullname;
        this.CurrentCivilStatus = CurrentCivilStatus;
        this.NewCivilStatus = NewCivilStatus;
    }
}
module.exports = thisDefaultContructor;