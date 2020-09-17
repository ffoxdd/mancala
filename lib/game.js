const _ = require('lodash')
const Board = require("./board")
const BoardPosition = require("./board_position")

class Game {
    constructor({currentPlayer = "A", board = new Board({})}) {
        this.currentPlayer = currentPlayer
        this.board = board
    }

    playTurn(startPosition) {
        let board = this.board

        board = board.grabStones(this.currentPlayer, startPosition)
        board = this.distributeStones(board, this.currentPlayer, startPosition)

        return new Game({
            currentPlayer: this._oppositePlayer(this.currentPlayer),
            board: board,
        })
    }

    distributeStones(board, player, index) {
        const startPosition = BoardPosition({player: player, index: index})
        const positionIterator = this.board.positionIterator(startPosition)

        positionIterator.next()

        while(board.stonesInHand() > 0) {
            const position = positionIterator.next().value
            board = board.dropStones(position, 1)
        }

        return board
    }

    _oppositePlayer(player) {
        return player == "A" ? "B" : "A"
    }
}

module.exports = Game
