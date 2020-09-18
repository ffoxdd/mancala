const _ = require('lodash')
const { Record, OrderedMap } = require('immutable')
const BoardPosition = require('./board_position')

const POCKETS = 6
const DEFAULT_STONES = 4

class Board {
    constructor({pockets = Board._buildPockets(), hand = 0}) {
        this.pockets = pockets
        this.hand = hand
    }

    stonesInHand() {
        return this.hand > 0
    }

    grabStones(player, index) {
        const position = BoardPosition({player: player, index: index})

        return new Board({
            pockets: this.pockets.set(position, 0),
            hand: this.hand + this.pockets.get(position),
        })
    }

    dropStones(position, count) {
        return new Board({
            pockets: this.pockets.set(position, this.pockets.get(position) + count),
            hand: this.hand - count,
        })
    }

    *positionIterator(startIndex){
        let started = false

        while(true) {
            for(const position of this.pockets.keys()) {
                if (position.equals(startIndex)) { started = true }
                if (!started) { continue }
                yield position
            }
        }
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
