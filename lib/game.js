const _ = require('lodash')
const Board = require("./board")
const BoardPosition = require("./board_position")
const { oppositePlayer } = require("./player")

class Game {
    constructor({currentPlayer = "A", board = new Board({}), isOver = false}) {
        this.currentPlayer = currentPlayer
        this.board = board
        this.isOver = isOver
    }

    playTurn(startIndex) {
        let board = this.board
        let startPosition = new BoardPosition({player: this.currentPlayer, index: startIndex})
        let lastPosition, isOver

        if (board.isEmptyAt(startPosition)) {
            return this
        }

        board = board.grabStones(startPosition);
        ({board, lastPosition} = this._distributeStones(board, startPosition));
        board = this._checkCapture(board, lastPosition);
        ({board, isOver} = this._checkEndgame(board));

        return new Game({
            currentPlayer: this._nextPlayer(lastPosition),
            board: board,
            isOver: isOver
        })
    }

    prettyPrint() {
        console.log(this.isOver ? "Over" : `Player: ${this.currentPlayer}`, "\n")
        this.board.prettyPrint()
    }

    _checkCapture(board, lastPosition) {
        if (board._isOwnEmptyPocket(lastPosition, this.currentPlayer)) {
            return this._captureOpponent(board, lastPosition)
        } else {
            return board
        }
    }

    _checkEndgame(board) {
        let isOver

        ({board, isOver} = this._checkEndgameForPlayer("A", board));

        if (isOver) {
            return {board, isOver}
        }

        ({board, isOver} = this._checkEndgameForPlayer("B", board));

        return {board, isOver}
    }

    _checkEndgameForPlayer(player, board) {
        if (board.anyStonesOnSide(oppositePlayer(player))) {
            return {board: board, isOver: false}
        }

        return {board: this._captureSide(player, board), isOver: true}
    }

    _captureSide(player, board) {
        let mancala = new BoardPosition({player: player, isMancala: true})

        for (const position of board.eachSidePosition(player)) {
            board = board.transfer(position, mancala)
        }

        return board
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

    _captureOpponent(board, lastPosition) {
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
