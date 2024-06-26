const config = {
    user: 'root',
    password: '123',
    server: '10.160.54.14',
    database: 'EmployeeManagementDB',
    options:{
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        instancename: 'SQLEXPRESS'
    },
    port: 1433
}
module.exports = config;