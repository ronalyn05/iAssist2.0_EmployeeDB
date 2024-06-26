class Employee{
    constructor(EmployeeId, EmployeeName, FirstName, MiddleName, LastName, MaidenName, 
        Birthdate, Age, BirthMonth, AgeBracket, Gender,
        MaritalStatus, SSS, PHIC, HDMF, TIN, HRANID, ContactNumber, 
        EmailAddress){
        this.EmployeeId = EmployeeId;
        this.EmployeeName = EmployeeName;
        this.FirstName = FirstName;
        this.MiddleName = MiddleName;
        this.LastName = LastName;
        this.MaidenName = MaidenName;
        this.Birthdate = Birthdate;
        this.Age = Age;
        this.BirthMonth = BirthMonth;
        this.AgeBracket = AgeBracket;
        this.Gender = Gender;
        this.MaritalStatus = MaritalStatus;
        this.SSS = SSS;
        this.PHIC = PHIC;
        this.HDMF = HDMF;
        this.TIN = TIN;
       // this.EmpAddressID = EmpAddressID;
        this.HRANID = HRANID;
        this.ContactNumber = ContactNumber;
        this.EmailAddress = EmailAddress;
    }
}

module.exports =  Employee ;


