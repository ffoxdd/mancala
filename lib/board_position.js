const { Record } = require('immutable')
const { oppositePlayer } = require("./player")
const { POCKETS } = require("./constants")

class BoardPosition extends Record({player: "A", index: undefined, isMancala: false}) {
    toString() {
        const index = this.isMancala ? "M" : this.index
        return `${this.player}${index}`
    }

    oppositePosition() {
        return new BoardPosition({
            player: oppositePlayer(this.player),
            index: POCKETS - this.index - 1,
        })
    }

    isOwnRegularPocket(player) {
        return (!this.isMancala && this.player == player)
    }

    isOwnMancala(player) {
        return this.player == player && this.isMancala
    }

    isOpponentMancala(player) {
        return this.isOwnMancala(oppositePlayer(player))
    }
}

module.exports = BoardPosition
