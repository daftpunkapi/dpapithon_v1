class grahak {
    constructor(socketId) {
        this.socketId = socketId;
        this.cursorX = null;
        this.cursorY = null;
        this.room = null;
    }
    setCursorPosition(x, y) {
        this.cursorX = x;
        this.cursorY = y;
    }
    updateRoom(data){
        this.room = data;
    }
}

module.exports = grahak;

