const _ = require('lodash')
const Board = require("./board")
const BoardPosition = require("./board_position")
const { oppositePlayer } = require("./player")

class Game {
    constructor({currentPlayer = "A", board = new Board({})}) {
        this.currentPlayer = currentPlayer
        this.board = board
    }

    playTurn(startIndex) {
        let board = this.board
        let startPosition = new BoardPosition({player: this.currentPlayer, index: startIndex})
        let lastPosition

        if (board.isEmptyAt(startPosition)) {
            return this
        }

        board = board.grabStones(startPosition);
        ({board, lastPosition} = this._distributeStones(board, startPosition))

        if (board._isOwnEmptyPocket(lastPosition, this.currentPlayer)) {
            board = this._capture(board, lastPosition)
        }

        return new Game({
            currentPlayer: this._nextPlayer(lastPosition),
            board: board,
        })
    }

    _distributeStones(board, startPosition) {
        const positionIterator = this.board.positionIterator(startPosition)
        let lastPosition

        positionIterator.next()

        while(board.hasStonesInHand()) {
            lastPosition = positionIterator.next().value

            if (lastPosition.isOpponentMancala(this.currentPlayer)) {
                continue
            }

            board = board.dropStones(lastPosition, 1)

        }

        return {board, lastPosition}
    }

    _capture(board, lastPosition) {
        let mancala = new BoardPosition({player: lastPosition.player, isMancala: true})

        return board.
            transfer(lastPosition, mancala).
            transfer(lastPosition.oppositePosition(), mancala)
    }

    _nextPlayer(lastPosition) {
        if (lastPosition.isOwnMancala(this.currentPlayer)) {
            return this.currentPlayer
        } else {
            return oppositePlayer(this.currentPlayer)
        }
    }
}

module.exports = Game
