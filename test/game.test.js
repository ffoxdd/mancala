const {assertThat, hasProperties, is, FeatureMatcher, allOf} = require('hamjest')
const { OrderedMap } = require('immutable')
const Game = require("../lib/game")
const Board = require("../lib/board")
const BoardPosition = require("../lib/board_position")

function hasConfiguration(value) {
    return new FeatureMatcher(
        value,
        "value with configuration", "configuration",
        (item) => item.configuration(),
    )
}

describe("#constructor", () => {
    test("sets up a new game", () => {
        let game = new Game({})

        assertThat(game, hasProperties({
            currentPlayer: is("A"),

            board: allOf(
                hasProperties({hand: is(0)}),

                hasConfiguration(
                    "A0:4,A1:4,A2:4,A3:4,A4:4,A5:4,AM:0," +
                    "B0:4,B1:4,B2:4,B3:4,B4:4,B5:4,BM:0"
                )
            ),

            isOver: is(false),
        }))
    })
})

describe("#playTurn", () => {
    test("plays a turn", () => {
        let game = new Game({})
        game = game.playTurn(0)

        assertThat(game, hasProperties({
            currentPlayer: is("B"),

            board: allOf(
                hasProperties({hand: is(0)}),

                hasConfiguration(
                    "A0:0,A1:5,A2:5,A3:5,A4:5,A5:4,AM:0," +
                    "B0:4,B1:4,B2:4,B3:4,B4:4,B5:4,BM:0"
                )
            ),

            isOver: is(false),
        }))
    })

    test("skips the opponent's mancala", () => {
        let game = new Game({
            board: new Board({
                pockets: OrderedMap([
                    [new BoardPosition({player: "A", index: 0}), 1],
                    [new BoardPosition({player: "A", index: 1}), 0],
                    [new BoardPosition({player: "A", index: 2}), 0],
                    [new BoardPosition({player: "A", index: 3}), 0],
                    [new BoardPosition({player: "A", index: 4}), 0],
                    [new BoardPosition({player: "A", index: 5}), 8],
                    [new BoardPosition({player: "A", isMancala: true}), 0],
                    [new BoardPosition({player: "B", index: 0}), 0],
                    [new BoardPosition({player: "B", index: 1}), 0],
                    [new BoardPosition({player: "B", index: 2}), 0],
                    [new BoardPosition({player: "B", index: 3}), 0],
                    [new BoardPosition({player: "B", index: 4}), 0],
                    [new BoardPosition({player: "B", index: 5}), 0],
                    [new BoardPosition({player: "B", isMancala: true}), 0],
                ]),
            }),
        })

        game = game.playTurn(5)

        assertThat(game, hasProperties({
            currentPlayer: is("B"),

            board: allOf(
                hasProperties({hand: is(0)}),

                hasConfiguration(
                    "A0:2,A1:0,A2:0,A3:0,A4:0,A5:0,AM:1," +
                    "B0:1,B1:1,B2:1,B3:1,B4:1,B5:1,BM:0"
                )
            ),

            isOver: is(false),
        }))
    })

    test("finishing in your mancala grants a free turn", () => {
        let game = new Game({})
        game = game.playTurn(2)

        assertThat(game, hasProperties({
            currentPlayer: is("A"),

            board: allOf(
                hasProperties({hand: is(0)}),

                hasConfiguration(
                    "A0:4,A1:4,A2:0,A3:5,A4:5,A5:5,AM:1," +
                    "B0:4,B1:4,B2:4,B3:4,B4:4,B5:4,BM:0"
                )
            ),

            isOver: is(false),
        }))
    })

    test("captures opponent stones", () => {
        let game = new Game({})

        game = game.playTurn(5)
        game = game.playTurn(2)
        game = game.playTurn(1)

        assertThat(game, hasProperties({
            currentPlayer: is("B"),

            board: allOf(
                hasProperties({hand: is(0)}),

                hasConfiguration(
                    "A0:5,A1:0,A2:5,A3:5,A4:5,A5:0,AM:7," +
                    "B0:0,B1:5,B2:0,B3:5,B4:5,B5:5,BM:1"
                )
            ),

            isOver: is(false),
        }))
    })

    test("does nothing when playing at an empty pocket", () => {
        let game = new Game({
            board: new Board({
                pockets: OrderedMap([
                    [new BoardPosition({player: "A", index: 0}), 4],
                    [new BoardPosition({player: "A", index: 1}), 4],
                    [new BoardPosition({player: "A", index: 2}), 0],
                    [new BoardPosition({player: "A", index: 3}), 4],
                    [new BoardPosition({player: "A", index: 4}), 4],
                    [new BoardPosition({player: "A", index: 5}), 4],
                    [new BoardPosition({player: "A", isMancala: true}), 0],
                    [new BoardPosition({player: "B", index: 0}), 4],
                    [new BoardPosition({player: "B", index: 1}), 4],
                    [new BoardPosition({player: "B", index: 2}), 4],
                    [new BoardPosition({player: "B", index: 3}), 4],
                    [new BoardPosition({player: "B", index: 4}), 4],
                    [new BoardPosition({player: "B", index: 5}), 4],
                    [new BoardPosition({player: "B", isMancala: true}), 0],
                ]),
            }),
        })

        let nextGame = game.playTurn(2)
        assertThat(nextGame, is(game))
    })

    test("doesn't perorm a capture when there are no stones on the opponent's side", () => {
        let game = new Game({
            board: new Board({
                pockets: OrderedMap([
                    [new BoardPosition({player: "A", index: 0}), 1],
                    [new BoardPosition({player: "A", index: 1}), 0],
                    [new BoardPosition({player: "A", index: 2}), 0],
                    [new BoardPosition({player: "A", index: 3}), 0],
                    [new BoardPosition({player: "A", index: 4}), 0],
                    [new BoardPosition({player: "A", index: 5}), 0],
                    [new BoardPosition({player: "A", isMancala: true}), 0],
                    [new BoardPosition({player: "B", index: 0}), 1],
                    [new BoardPosition({player: "B", index: 1}), 0],
                    [new BoardPosition({player: "B", index: 2}), 0],
                    [new BoardPosition({player: "B", index: 3}), 0],
                    [new BoardPosition({player: "B", index: 4}), 0],
                    [new BoardPosition({player: "B", index: 5}), 0],
                    [new BoardPosition({player: "B", isMancala: true}), 0],
                ]),
            }),

            currentPlayer: "A",
        })

        game = game.playTurn(0)

        assertThat(game, hasProperties({
            currentPlayer: is("B"),

            board: allOf(
                hasProperties({hand: is(0)}),

                hasConfiguration(
                    "A0:0,A1:1,A2:0,A3:0,A4:0,A5:0,AM:0," +
                    "B0:1,B1:0,B2:0,B3:0,B4:0,B5:0,BM:0"
                )
            ),

            isOver: is(false),
        }))
    })

    test("captures remaining stones and ends the game", () => {
        let game = new Game({
            board: new Board({
                pockets: OrderedMap([
                    [new BoardPosition({player: "A", index: 0}), 4],
                    [new BoardPosition({player: "A", index: 1}), 4],
                    [new BoardPosition({player: "A", index: 2}), 4],
                    [new BoardPosition({player: "A", index: 3}), 4],
                    [new BoardPosition({player: "A", index: 4}), 4],
                    [new BoardPosition({player: "A", index: 5}), 0],
                    [new BoardPosition({player: "A", isMancala: true}), 0],
                    [new BoardPosition({player: "B", index: 0}), 0],
                    [new BoardPosition({player: "B", index: 1}), 0],
                    [new BoardPosition({player: "B", index: 2}), 0],
                    [new BoardPosition({player: "B", index: 3}), 0],
                    [new BoardPosition({player: "B", index: 4}), 0],
                    [new BoardPosition({player: "B", index: 5}), 1],
                    [new BoardPosition({player: "B", isMancala: true}), 0],
                ]),
            }),

            currentPlayer: "B",
        })

        game = game.playTurn(5)

        assertThat(game, hasProperties({
            board: allOf(
                hasProperties({hand: is(0)}),

                hasConfiguration(
                    "A0:0,A1:0,A2:0,A3:0,A4:0,A5:0,AM:20," +
                    "B0:0,B1:0,B2:0,B3:0,B4:0,B5:0,BM:1"
                )
            ),

            isOver: is(true),
        }))
    })



    test("can play a full game", () => {
        let game = new Game({})

        const moves = [
            2, 0, 2, 3, 2, 4, 3, 3, 2, 4,
            5, 5, 5, 4, 1, 0, 0, 5, 3, 5,
            5, 3, 5, 4, 5, 2, 5, 1, 5, 3,
            4, 5, 2, 3, 3, 5, 2, 4, 4, 5
        ]

        for (const index of moves) {
            game = game.playTurn(index)
        }

        assertThat(game, hasProperties({
            board: allOf(
                hasProperties({hand: is(0)}),

                hasConfiguration(
                    "A0:0,A1:0,A2:0,A3:0,A4:0,A5:0,AM:28," +
                    "B0:0,B1:0,B2:0,B3:0,B4:0,B5:0,BM:20"
                )
            ),

            isOver: is(true),
        }))
    })
})

describe(".fromJSON", () => {
    test("constructs a game from JSON", () => {
        const json = {
            current_player: "B",
            board: "A0:5,A1:0,A2:5,A3:5,A4:5,A5:0,AM:7,B0:0,B1:5,B2:0,B3:5,B4:5,B5:5,BM:1",
            isOver: false,
        }

        game = Game.fromJSON(json)

        assertThat(game, hasProperties({
            currentPlayer: "B",

            board: allOf(
                hasProperties({hand: is(0)}),
                hasConfiguration("A0:5,A1:0,A2:5,A3:5,A4:5,A5:0,AM:7,B0:0,B1:5,B2:0,B3:5,B4:5,B5:5,BM:1")
            ),

            isOver: is(false),
        }))
    })
})
