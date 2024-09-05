const fs = require('fs');
const readline = require('readline');

class Split {
  /**
   * 
   * @param {string} input 
   * @param {string} output 
   * @param {number} linesPerFile 
   */
  constructor(input, output, linesPerFile) {
    this.input = input;
    const extIndex = output.lastIndexOf('.');
    this.outputStart = output.substring(0, extIndex);
    this.outputEnd = output.substring(extIndex + 1);
    this.linesPerFile = linesPerFile;
    this.linesInFile = 0;
    this.count = 0;
    this.readFinished = false;
  }

  async splitInFiles() {
    this.linesInFile = 0;
    this.count = 0;
    this.readFinished = false;

    return new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(this.input);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });
  
      const writeStream = this._getWriteStream();
  
      rl.on('line', (line) => {
        this._getWriteStream().write(line);
      });
  
      rl.on('close', () => {
        console.log('Arquivo lido com sucesso!');
        this.readFinished = true;
        this._getWriteStream().end();
      });
  
      let error;
      fileStream.on('error', err => error = err);
      rl.on('error', err => error = err);
      this._getWriteStream().on('error', err => error = err);
      this._getWriteStream().on('close', () => {
        if (this.readFinished)
        return error ? reject(error) : resolve()
      });
    })
  }

  _getWriteStream() {
    if (this.linesPerFile === this.linesInFile) {
      this.writeStream.close();
      this.writeStream = null;
    }
    if (!this.writeStream) {
      this.writeStream = this._createWriteStream();
    }
    return this.writeStream;
  }

  _createWriteStream() {
    this.linesInFile = 0;
    this.count++;
    const output = `${this.outputStart}.${this.count}.${this.outputEnd}`;
    const writeStream = fs.createWriteStream(output);
    const originalWrite = writeStream.write;
    writeStream.write = (line) => {
      originalWrite.call(writeStream, `${line}\n`);
      this.linesInFile++;
    };
    return writeStream;
  }
}

module.exports = Split;