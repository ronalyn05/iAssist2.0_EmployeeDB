const config = {
    user: 'admin',
    password: '12345',
    server: '10.160.54.11',
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