const {assertThat, hasProperty, hasProperties, is, not, isEmpty, contains, allOf} = require('hamjest')
const Game = require("../lib/game")

describe("#constructor", () => {
    test("sets up a new game", () => {
        let game = new Game()

        assertThat(game, hasProperties({
            currentPlayer: is("A"),

            board: hasProperties({
                hand: hasProperties({stones: is(0)}),

                sides: allOf(
                    hasProperty("A", hasProperties({
                        pockets: contains(
                            hasProperties({stones: is(4)}),
                            hasProperties({stones: is(4)}),
                            hasProperties({stones: is(4)}),
                            hasProperties({stones: is(4)}),
                            hasProperties({stones: is(4)}),
                            hasProperties({stones: is(4)}),
                        ),

                        mancala: hasProperties({stones: is(0)}),
                    })),

                    hasProperty("B", hasProperties({
                        pockets: contains(
                            hasProperties({stones: is(4)}),
                            hasProperties({stones: is(4)}),
                            hasProperties({stones: is(4)}),
                            hasProperties({stones: is(4)}),
                            hasProperties({stones: is(4)}),
                            hasProperties({stones: is(4)}),
                        ),

                        mancala: hasProperties({stones: is(0)}),
                    })),
                ),
            }),
        }))
    })
})

describe("#playTurn", () => {
    test("plays a turn", () => {
        let game = new Game()

        game.playTurn(0)

        assertThat(game, hasProperties({
            currentPlayer: is("B"),

            board: hasProperties({
                hand: hasProperties({stones: is(0)}),

                sides: allOf(
                    hasProperty("A", hasProperties({
                        pockets: contains(
                            hasProperties({stones: is(0)}),
                            hasProperties({stones: is(5)}),
                            hasProperties({stones: is(5)}),
                            hasProperties({stones: is(5)}),
                            hasProperties({stones: is(5)}),
                            hasProperties({stones: is(4)}),
                        ),

                        mancala: hasProperties({stones: is(0)}),
                    })),

                    hasProperty("B", hasProperties({
                        pockets: contains(
                            hasProperties({stones: is(4)}),
                            hasProperties({stones: is(4)}),
                            hasProperties({stones: is(4)}),
                            hasProperties({stones: is(4)}),
                            hasProperties({stones: is(4)}),
                            hasProperties({stones: is(4)}),
                        ),

                        mancala: hasProperties({stones: is(0)}),
                    })),
                ),
            }),
        }))
    })
})
