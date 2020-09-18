const _ = require('lodash')
const { Record, OrderedMap } = require('immutable')
const BoardPosition = require('./board_position')
const { POCKETS, DEFAULT_STONES } = require("./constants")

class Board {
    constructor({pockets = Board._buildPockets(), hand = 0}) {
        this.pockets = pockets
        this.hand = hand
    }

    hasStonesInHand() {
        return this.hand > 0
    }

    isEmptyAt(position) {
        return this._at(position) == 0
    }

    anyStonesOnSide(player) {
        for (const position of this.eachSidePosition(player)) {
            if (!this.isEmptyAt(position)) {
                return true
            }
        }

        return false
    }

    eachSidePosition(player) {
        return this._sidePockets(player).keys()
    }

    _sidePockets(player){
        return this.pockets.filter((stones, position) => position.isSidePocket(player))
    }

    grabStones(position) {
        return new Board({
            pockets: this.pockets.set(position, 0),
            hand: this.hand + this._at(position),
        })
    }

    dropStones(position, count) {
        return new Board({
            pockets: this.pockets.set(position, this._at(position) + count),
            hand: this.hand - count,
        })
    }

    transfer(fromPosition, toPosition) {
        return new Board({
            pockets: this.pockets.
                set(toPosition, this._at(toPosition) + this._at(fromPosition)).
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

    prettyPrint() {
        const entriesA = [...this._sidePockets("A").values()]
        const entriesB = [...this._sidePockets("B").values()]

        const mancalaA = this._at(new BoardPosition({player: "A", isMancala: true}))
        const mancalaB = this._at(new BoardPosition({player: "B", isMancala: true}))

        const matrix = [
            ["",       ...entriesB.reverse(),        ""],
            [mancalaB, "", "", "", "", "", "", mancalaA],
            ["",       ...entriesA,                  ""]
        ]

        console.log(Board._matrixString(matrix))
    }

    static _matrixString(matrix) {
        return matrix.map(row => row.map(n => String(n).padEnd(2)).join(" ")).join("\n")
    }

    _isOwnEmptyPocket(position, player) {
        return position.isSidePocket(player) && this._at(position) == 1
    }

    _at(position) {
        return this.pockets.get(position)
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
