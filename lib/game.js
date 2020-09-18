const _ = require('lodash')
const Board = require("./board")
const BoardPosition = require("./board_position")

class Game {
    constructor({currentPlayer = "A", board = new Board({})}) {
        this.currentPlayer = currentPlayer
        this.board = board
    }

    playTurn(startIndex) {
        let board = this.board
        let lastPosition

        board = board.grabStones(this.currentPlayer, startIndex);
        ({board, lastPosition} = this.distributeStones(board, this.currentPlayer, startIndex))

        if (this._isOwnEmptyPocket(board, lastPosition)) {
            board = this._capture(board, lastPosition)
        }

        let currentPlayer = this.currentPlayer

        if (!this._isOwnMancala(lastPosition)) {
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

        while(board.stonesInHand()) {
            lastPosition = positionIterator.next().value

            if (this._isOpponentMancala(lastPosition)) {
                continue
            }

            board = board.dropStones(lastPosition, 1)

        }

        return {board, lastPosition}
    }

    _isOwnEmptyPocket(board, position) {
        return (
            !position.isMancala &&
            position.player == this.currentPlayer &&
            board.pockets.get(position) == 1
        )
    }

    _capture(board, lastPosition) {
        let fromPosition = this._oppositePosition(lastPosition)
        let toPosition = this._mancala(lastPosition.player)

        return board.transfer(fromPosition, toPosition)
    }

    _oppositePosition(lastPosition) {
        const POCKETS = 6 // TODO: DRY

        return BoardPosition({
            player: this._oppositePlayer(lastPosition.player),
            index: POCKETS - lastPosition.index - 1,
        })
    }

    _mancala(player) {
        return BoardPosition({player: player, isMancala: true})
    }

    _isOwnMancala(position) {
        return (
            position.player == this.currentPlayer &&
            position.isMancala
        )
    }

    _isOpponentMancala(position) {
        return (
            position.player == this._oppositePlayer(this.currentPlayer) &&
            position.isMancala
        )
    }

    _oppositePlayer(player) {
        return player == "A" ? "B" : "A"
    }
}

module.exports = Game
