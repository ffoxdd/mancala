const _ = require('lodash')
const Board = require("./board")

class Game {
    constructor() {
        this.currentPlayer = "A"
        this.board = new Board({})
    }

    playTurn(startPosition) {
        this.board = this.board.grabStones(this.currentPlayer, startPosition)
        this.board = this.board.distributeStones(this.currentPlayer, startPosition)

        this._switchPlayers()
    }

    _switchPlayers() {
        this.currentPlayer = this._oppositePlayer(this.currentPlayer)
    }

    _oppositePlayer(player) {
        return player == "A" ? "B" : "A"
    }
}

module.exports = Game
