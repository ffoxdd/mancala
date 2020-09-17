const _ = require('lodash')
const Side = require("./side")
const Pocket = require("./pocket")

class Board {
    constructor() {
        this.sides = {A: new Side(), B: new Side()}
        this.hand = new Pocket(0)
    }

    grabStones(player, position) {
        this._transfer(this._pocketAt(player, position), this.hand)
    }

    distributeStones(player, startPosition) {
        let iterator = this._iteratorAt(player, startPosition)
        iterator.next()

        while (!this.hand.isEmpty()) {
            let context = iterator.next().value

            // if (this._isOpponentMancala(side, context)) {
            //     continue
            // }

            this._transfer(this.hand, context.pocket, 1)
        }
    }

    _pocketAt(player, position) {
        return this.sides[player].pockets[position]
    }

    _isOpponentMancala(player, context) {
        return context.isMancala && context.player != player
    }

    *_iteratorAt(player, startPosition) {
        while(true) {
            for(const context of this._sideIterator(player, startPosition)) {
                yield _.merge(context, {player: player})
            }

            player = this._oppositePlayer(player)
            startPosition = 0
        }
    }

    _sideIterator(player, startPosition) {
        return this.sides[player].iteratorAt(startPosition)
    }

    _transfer(fromPocket, toPocket, count) {
        count = count || fromPocket.stones
        fromPocket.remove(count)
        toPocket.add(count)
    }
}

module.exports = Board
