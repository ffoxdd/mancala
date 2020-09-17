const { Record } = require('immutable')

const BoardPosition = Record({
    player: "A",
    index: undefined,
    isMancala: false,
})

module.exports = BoardPosition
