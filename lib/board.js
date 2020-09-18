const _ = require('lodash')
const { Record, OrderedMap } = require('immutable')
const BoardPosition = require('./board_position')
const { POCKETS, DEFAULT_STONES } = require("./constants")

class DefaultPocketsFactory {
    static pockets() {
        return OrderedMap([
            ...DefaultPocketsFactory._side("A"),
            ...DefaultPocketsFactory._side("B"),
        ])
    }

    static _side(player) {
        return [
            ...DefaultPocketsFactory._sidePockets(player),
            DefaultPocketsFactory._mancala(player),
        ]
    }

    static _sidePockets(player) {
        return _.range(POCKETS).map(index =>
            [new BoardPosition({player: player, index: index}), DEFAULT_STONES]
        )
    }

    static _mancala(player) {
        return [new BoardPosition({player: player, isMancala: true}), 0]
    }
}

class PrettyPrinter {
    constructor(board) {
        this.board = board
    }

    print() {
        console.log(this._stoneMatrixString())
    }

    _stoneMatrixString() {
        return PrettyPrinter._matrixString(this._stoneMatrix())
    }

    static _matrixString(matrix) {
        return matrix.map(row => row.map(n => String(n).padEnd(2)).join(" ")).join("\n")
    }

    _stoneMatrix() {
        return [
            ["",           ...this._sideEntries("B").reverse(),          ""],
            [this._mancala("B"), "", "", "", "", "", "", this._mancala("A")],
            ["",               ...this._sideEntries("A"),                ""],
        ]
    }

    _sideEntries(player) {
        return [...this.board._sidePockets(player).values()]
    }

    _mancala(player) {
        return this.board._at(new BoardPosition({player: player, isMancala: true}))
    }
}

class ConfigurationParser {
    static pockets(configuration) {
        return OrderedMap(ConfigurationParser._pocketTuples(configuration))
    }

    static _pocketTuples(configuration) {
        return configuration.
            split(",").
            map(pocketString => pocketString.split(":")).
            map(ConfigurationParser._pocket)
    }

    static _pocket([positionString, stonesString]) {
        const position = ConfigurationParser._position(positionString)
        const stones = Number(stonesString)

        return [position, stones]
    }

    static _position(positionString) {
        const [player, index] = positionString.split("")

        if (index == "M") {
            return new BoardPosition({player: player, isMancala: true})
        } else {
            return new BoardPosition({player: player, index: Number(index)})
        }
    }
}

class Board extends Record({pockets: DefaultPocketsFactory.pockets(), hand: 0}) {
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

    configuration() {
        return [...this.pockets.entries()].map(([position, stones]) => {
            return `${position}:${stones}`
        }).join()
    }

    prettyPrint() {
        new PrettyPrinter(this).print()
    }

    static fromConfiguration(configuration) {
        return new Board({pockets: ConfigurationParser.pockets(configuration)})
    }

    _sidePockets(player){
        return this.pockets.filter((stones, position) => position.isSidePocket(player))
    }

    _isOwnEmptyPocket(position, player) {
        return position.isSidePocket(player) && this._at(position) == 1
    }

    _at(position) {
        return this.pockets.get(position)
    }
}

module.exports = Board
