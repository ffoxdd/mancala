const _ = require('lodash')
const Board = require("./board")
const BoardPosition = require("./board_position")

class Game {
    constructor({currentPlayer = "A", board = new Board({})}) {
        this.currentPlayer = currentPlayer
        this.board = board
    }

    playTurn(startIndex) {
        let board = this.board, currentPlayer = this.currentPlayer
        let lastPosition

        board = board.grabStones(this.currentPlayer, startIndex);
        ({board, lastPosition} = this.distributeStones(board, this.currentPlayer, startIndex))

        if (!this._isPlayerMancala(currentPlayer, lastPosition)) {
            currentPlayer = this._oppositePlayer(currentPlayer)
        }

        return new Game({
            currentPlayer: currentPlayer,
            board: board,
        })
    }

    distributeStones(board, player, index) {
        const startPosition = BoardPosition({player: player, index: index})
        const positionIterator = this.board.positionIterator(startPosition)
        let lastPosition

        positionIterator.next()

        while(board.stonesInHand() > 0) {
            lastPosition = positionIterator.next().value
            board = board.dropStones(lastPosition, 1)
        }

        return {board, lastPosition}
    }

    _isPlayerMancala(player, position) {
        return position.player == player && position.isMancala
    }

    _oppositePlayer(player) {
        return player == "A" ? "B" : "A"
    }
}

module.exports = Game
