const fs = require('fs');

class FileHandler {
    constructor(filePath) {
        this.filePath = filePath;
    }

    appendToFile(text) {
        try {
            fs.appendFileSync(this.filePath, text); // Sync version
            
        } catch (err) {
            console.error(`Error writing to file: ${err.message}`);
            throw err;
        }
    }

    readFileContent() {
        try {
            if (!fs.existsSync(this.filePath)) {
                throw new Error(`File not found: ${this.filePath}`);
            }
            return fs.readFileSync(this.filePath, 'utf8'); // Return file content as string
        } catch (err) {
            console.error(`Error reading file: ${err.message}`);
            throw err;
        }
    }
}

module.exports = FileHandler;
