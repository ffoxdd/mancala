const _ = require('lodash')
const { Record, OrderedMap } = require('immutable')
const BoardPosition = require('./board_position')
const { POCKETS, DEFAULT_STONES } = require("./constants")

class Board {
    constructor({pockets = Board._buildPockets(), hand = 0}) {
        this.pockets = pockets
        this.hand = hand
    }

    stonesInHand() {
        return this.hand > 0
    }

    grabStones(position) {
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

    transfer(fromPosition, toPosition) {
        return new Board({
            pockets: this.pockets.
                set(toPosition, this.pockets.get(toPosition) + this.pockets.get(fromPosition)).
                set(fromPosition, 0),

            hand: this.hand,
        })
    }

    *positionIterator(startPosition){
        let started = false

        while(true) {
            for(const position of this.pockets.keys()) {
                if (position.equals(startPosition)) { started = true }
                if (!started) { continue }
                yield position
            }
        }
    }

    get description() {
        return [...this.pockets.entries()].map(([position, stones]) => {
            return `${position}:${stones}`
        }).join()
    }

    _isOwnEmptyPocket(position, player) {
        return position.isOwnRegularPocket(player) && this.pockets.get(position) == 1
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
            [new BoardPosition({player: player, index: index}), DEFAULT_STONES]
        )
    }

    static _buildMancala(player) {
        return [new BoardPosition({player: player, isMancala: true}), 0]
    }
}

module.exports = Board
