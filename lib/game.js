const _ = require('lodash')
const Board = require("./board")

class Game {
    constructor({currentPlayer = "A", board = new Board({})}) {
        this.currentPlayer = currentPlayer
        this.board = board
    }

    playTurn(startPosition) {
        let board = this.board

        board = board.grabStones(this.currentPlayer, startPosition)
        board = board.distributeStones(this.currentPlayer, startPosition)

        return new Game({
            currentPlayer: this._oppositePlayer(this.currentPlayer),
            board: board,
        })
    }

    _oppositePlayer(player) {
        return player == "A" ? "B" : "A"
    }
}

module.exports = Game
