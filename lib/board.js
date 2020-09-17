const _ = require('lodash')
const { Record, OrderedMap } = require('immutable')

const BoardPosition = Record({
    player: "A",
    index: undefined,
    isMancala: false,
})

const POCKETS = 6
const DEFAULT_STONES = 4

class Board {
    constructor({pockets = Board._buildPockets(), hand = 0}) {
        this.pockets = pockets
        this.hand = hand
    }

    grabStones(player, index) {
        const position = BoardPosition({player: player, index: index})

        return new Board({
            pockets: this.pockets.set(position, 0),
            hand: this.hand + this.pockets.get(position),
        })
    }

    distributeStones(player, index) {
        let board = this

        const startPosition = BoardPosition({player: player, index: index})
        const positionIterator = this._positionIterator(startPosition)

        positionIterator.next()

        while(board.hand > 0) {
            const position = positionIterator.next().value
            board = board._dropStones(position, 1)
        }

        return board
    }

    get description() {
        return [...this.pockets.entries()].map(([position, stones]) => {
            return `${this._positionToString(position)}:${stones}`
        }).join()
    }

    _positionToString(position) {
        let index = position.isMancala ? "M" : position.index
        return `${position.player}${index}`
    }

    _dropStones(position, count) {
        return new Board({
            pockets: this.pockets.set(position, this.pockets.get(position) + count),
            hand: this.hand - count,
        })
    }

    *_positionIterator(startPosition){
        let started = false

        while(true) {
            for(const position of this.pockets.keys()) {
                if (position.equals(startPosition)) { started = true }
                if (!started) { continue }
                yield position
            }
        }
    }

    static _buildPockets() {
        return OrderedMap([
            ...Board._buildSidePockets("A"),
            ...Board._buildSidePockets("B"),
        ])
    }

    static _buildSidePockets(player) {
        return [
            ...Board._buildRegularPockets(player),
            Board._buildMancala(player),
        ]
    }

    static _buildRegularPockets(player) {
        return _.range(POCKETS).map(index =>
            [BoardPosition({player: player, index: index}), DEFAULT_STONES]
        )
    }

    static _buildMancala(player) {
        return [BoardPosition({player: player, isMancala: true}), 0]
    }
}

module.exports = Board
