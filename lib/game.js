const _ = require('lodash')
const Side = require("./side")
const Pocket = require("./pocket")

class Game {
    constructor() {
        this.currentPlayer = Game.PLAYER_A
        this.sides = Game._buildSides()
        this.hand = new Pocket(0)
    }

    playTurn(startPosition) {
        this._grabStones(startPosition)
        this._distributeStones(startPosition)
        this._switchPlayers()
    }

    _grabStones(position) {
        this._transfer(this._pocketAt(position), this.hand)
    }

    _pocketAt(position) {
        return this._currentSide().pockets[position]
    }

    _currentSide() {
        return this.sides[this.currentPlayer]
    }

    _distributeStones(startPosition) {
        let iterator = this._iteratorAt(this.currentPlayer, startPosition)
        iterator.next()

        while (!this.hand.isEmpty()) {
            let context = iterator.next().value

            // if (this._isOpponentMancala(context)) {
            //     continue
            // }

            this._transfer(this.hand, context.pocket, 1)
        }
    }

    _isOpponentMancala(context) {
        return context.isMancala && context.player != this.currentPlayer
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

    static _buildSides() {
        let sides = {}

        sides[Game.PLAYER_A] = new Side()
        sides[Game.PLAYER_B] = new Side()

        return sides
    }

    _transfer(fromPocket, toPocket, count) {
        count = count || fromPocket.stones
        fromPocket.remove(count)
        toPocket.add(count)
    }

    _oppositePlayer(player) {
        return player == Game.PLAYER_A ? Game.PLAYER_B : Game.PLAYER_A
    }

    _switchPlayers() {
        this.currentPlayer = this._oppositePlayer(this.currentPlayer)
    }
}

Game.PLAYER_A = "A"
Game.PLAYER_B = "B"

module.exports = Game
