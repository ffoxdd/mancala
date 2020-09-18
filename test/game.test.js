const {assertThat, hasProperties, is} = require('hamjest')
const Game = require("../lib/game")

describe("#constructor", () => {
    test("sets up a new game", () => {
        let game = new Game({})

        assertThat(game, hasProperties({
            currentPlayer: is("A"),

            board: hasProperties({
                hand: is(0),

                description: is(
                    "A0:4,A1:4,A2:4,A3:4,A4:4,A5:4,AM:0," +
                    "B0:4,B1:4,B2:4,B3:4,B4:4,B5:4,BM:0"
                )
            }),
        }))
    })
})

describe("#playTurn", () => {
    test("plays a turn", () => {
        let game = new Game({})
        game = game.playTurn(0)

        assertThat(game, hasProperties({
            currentPlayer: is("B"),

            board: hasProperties({
                hand: is(0),

                description: is(
                    "A0:0,A1:5,A2:5,A3:5,A4:5,A5:4,AM:0," +
                    "B0:4,B1:4,B2:4,B3:4,B4:4,B5:4,BM:0"
                )
            }),
        }))
    })

    test("finishing in your mancala grants a free turn", () => {
        let game = new Game({})
        game = game.playTurn(2)

        assertThat(game, hasProperties({
            currentPlayer: is("A"),

            board: hasProperties({
                hand: is(0),

                description: is(
                    "A0:4,A1:4,A2:0,A3:5,A4:5,A5:5,AM:1," +
                    "B0:4,B1:4,B2:4,B3:4,B4:4,B5:4,BM:0"
                )
            }),
        }))
    })
})
