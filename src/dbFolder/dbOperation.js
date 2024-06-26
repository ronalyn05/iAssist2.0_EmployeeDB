// dbOperation.js
const config = require('./dbConfig');
const sql = require('mssql');
const fs = require('fs'); // Import fs module to read files

const insertPDF = async (filename) => {
    try {
        let pool = await sql.connect(config);

        // Read the file from the uploads directory
        const fileData = fs.readFileSync(`uploads/${filename}`);

        // Convert binary data to Base64 string
        const base64Data = Buffer.from(fileData).toString('base64');

        let file = await pool.request()
            .input('pdf', sql.NVarChar(sql.MAX), base64Data) // Store Base64 string in NVARCHAR column
            .query(`
                INSERT INTO Sample1 (pdf)
                VALUES (@pdf)
            `); 

        console.log(file);
    } catch (error) {
        console.error("Error updating employee attendance:", error);
        throw error;
    }
}


module.exports = {
    insertPDF
};