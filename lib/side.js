const _ = require('lodash')
const Pocket = require("./pocket")

class Side {
    constructor() {
        this.pockets = Side._buildPockets()
        this.mancala = new Pocket(0)
    }

    static _buildPockets() {
        return _.times(Side.POCKET_COUNT, () => new Pocket(Side.DEFAULT_STONES))
    }

    *iteratorAt(startPosition) {
        for (let i = startPosition; i < this.pockets.length; i++) {
            yield {pocket: this.pockets[i], position: i, isMancala: false}
        }

        yield {pocket: this.mancala, isMancala: true}
    }
}

Side.POCKET_COUNT = 6
Side.DEFAULT_STONES = 4

module.exports = Side
