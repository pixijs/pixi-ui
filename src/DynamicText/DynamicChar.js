function DynamicChar() {
    //styledata (texture, orig width, orig height)
    this.style = null;

    //char data
    this.data = null;

    //is this char space?
    this.space = false;

    //is this char newline?
    this.newline = false;

    //charcode
    this.charcode = 0;

    //char string value
    this.value = "";

    //word index
    this.wordIndex = -1;

    //line index of char
    this.lineIndex = -1;

    //cache for sprite
    this.sprite = null;
}

DynamicChar.prototype.constructor = DynamicChar;
module.exports = DynamicChar;