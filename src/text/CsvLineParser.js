
class CsvLineParser {
  /**
   * 
   * @param {string} delimiterChar char used as string delimiter
   * @param {string} commaChar char used as value separator
   * @param {string} scapeChar scape char to allow delimiterChar inside a delimited field
   */
  constructor(delimiterChar = '"', commaChar = ',', scapeChar = '\\') {
    this.delimiterChar = delimiterChar;
    this.commaChar = commaChar;
    this.scapeChar = scapeChar;
    this.currentIndex = null;
    this.values = null;
    this.commaIndex = null;
    this.delimitedStartIndex = null;
  }

  _getDelimiterIndex(start = this.currentIndex) {
    let index = this.text.indexOf(this.delimiterChar, start);
    if (index <= 0) return index;
    while (index > 0 && this.text[index-1] === this.scapeChar) {
      index = this.text.indexOf(this.delimiterChar, index+1);
    }
    return index;
  }

  _startValues(text) {
    this.text = text;
    this.currentIndex = 0;
    this.values = [];
    this.commaIndex = this.text.indexOf(this.commaChar, this.currentIndex);
    this.delimitedStartIndex = this._getDelimiterIndex(this.currentIndex);
  }

  _hasMoreChars() {
    return this.currentIndex < this.text.length;
  }

  _setCurrentIndex(index) {
    this.currentIndex = index;
    this.commaIndex = this.text.indexOf(this.commaChar, index);
    this.delimitedStartIndex = this._getDelimiterIndex(index);
  }

  _consumeUntilIndex(index) {
    const value = this.text.substring(this.currentIndex, index).trim();
    this._setCurrentIndex(index + 1);
    return value;
  }

  _consumeNextValue() {
    if (this.commaIndex === -1) {
      return this._consumeUntilIndex(this.text.length);
    }

    if (this.delimitedStartIndex === -1 || this.commaIndex < this.delimitedStartIndex) {
      return this._consumeUntilIndex(this.commaIndex);
    }

    const delimitedEndIndex = this._getDelimiterIndex(this.delimitedStartIndex + 1);
    this.commaIndex = this.text.indexOf(this.commaChar, delimitedEndIndex + 1);
    return this._consumeUntilIndex(this.commaIndex === -1 ? this.text.length : this.commaIndex);
  }

  extractValues(text) {
    this._startValues(text);
    while (this._hasMoreChars()) {
      this.values.push(this._consumeNextValue());
    }
    return this.values;
  }
}

module.exports = CsvLineParser;