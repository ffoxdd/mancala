const {assertThat, hasProperties, contains, is} = require('hamjest')
const Side = require("../lib/side")

test("instantiates a new side", () => {
    let side = new Side()

    assertThat(side, hasProperties({
        pockets: contains(
            hasProperties({stones: is(4)}),
            hasProperties({stones: is(4)}),
            hasProperties({stones: is(4)}),
            hasProperties({stones: is(4)}),
            hasProperties({stones: is(4)}),
            hasProperties({stones: is(4)}),
        ),

        mancala: hasProperties({stones: is(0)}),
    }))
})

describe("#iteratorAt", () => {
    test("iterates, starting from the provided position", () => {
        let side = new Side()
        let visitedSides = []

        for (const pocket of side.iteratorAt(3)) {
            visitedSides.push(pocket)
        }

        assertThat(visitedSides, contains(
            hasProperties({pocket: side.pockets[3], position: 3, isMancala: false}),
            hasProperties({pocket: side.pockets[4], position: 4, isMancala: false}),
            hasProperties({pocket: side.pockets[5], position: 5, isMancala: false}),
            hasProperties({pocket: side.mancala, isMancala: true}),
        ))
    })
})
