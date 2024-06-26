class Employee {
    constructor(EmployeeId, LastName, FirstName, MiddleName, EmailAddress, Password, Role) {
        this.UserId = null; // UserId will be auto-incremented by the database
        this.EmployeeId = EmployeeId;
        this.LastName = LastName;
        this.FirstName = FirstName;
        this.MiddleName = MiddleName;
        this.EmailAddress = EmailAddress;
        this.Password = Password;
        this.Role = Role;
    }
}

module.exports = Employee;
