const fs = require('fs');
const readline = require('readline');

const CsvLineParser = require('../../text/CsvLineParser');

class SqlInsertsChanger {
  constructor(input, output, replaces) {
    this.input = input;
    this.output = output;
    this.replaces = replaces;
    this.valuesParser = new CsvLineParser("'");
    this.lineCount = 0;
  }

  async replaceValues() {
    const fileStream = fs.createReadStream(this.input);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    const writeStream = fs.createWriteStream(this.output);

    rl.on('line', (line) => {
      writeStream.write(`${this._processLine(line)}\n`);
    });

    rl.on('close', () => {
      console.log('Arquivo lido com sucesso!');
      writeStream.end();
    });

    let error;
    fileStream.on('error', err => {
      console.error(err);
      error = err
    });
    rl.on('error', err => {
      console.error(err);
      error = err
    });
    writeStream.on('error', err => {
      console.error(err);
      error = err
    });

    return new Promise((resolve, reject) => {
      writeStream.on('close', () => error ? reject(error) : resolve());
    })
  }

  _processLine(line = '') {
    if (!line.startsWith('insert into ')) {
      throw new Error (`Invalid line: ${line}`);
    }
    const { line_start, columns, line_middle, values, line_end } = this._splitLineComponents(line);
    Object.keys(this.replaces).forEach(column => {
      const value = this.replaces[column];
      const index = columns.findIndex(col => {
        if (col.startsWith('`')) col = col.substring(1, col.length - 1);
        return col === column
      });
      if (index === -1) throw new Error (`Invalid column: ${column}`);
      values[index] = value;
    });
    this.lineCount++;
    if (String(this.lineCount).endsWith('000')) console.log(`Process ${this.lineCount} lines`);
    return line_start
     + columns.join(', ')
     + line_middle
     + values.join(', ')
     + line_end;
  }

  _splitLineComponents(line) {
    const columns_start_index = line.indexOf('(') + 1;
    const line_start = line.substring(0, columns_start_index);
    const columns_end_index = line.indexOf(')', columns_start_index);
    const columns = line.substring(columns_start_index, columns_end_index).split(',').map(c => c.trim());
    const values_start_index = line.indexOf('(', columns_end_index) + 1;
    const line_middle = line.substring(columns_end_index, values_start_index);
    const values_end_index = line.lastIndexOf(')');
    const values = this.valuesParser.extractValues(line.substring(values_start_index, values_end_index));
    if (columns.length !== values.length) {
      const json = JSON.stringify({ columns, values });
      throw new Error(`Invalid Line: ${line}. Columns and Values has different sizes: ${json}`);
    }
    const line_end = line.substring(values_end_index);
    return { line_start, columns, line_middle, values, line_end };
  }
}

module.exports = SqlInsertsChanger;