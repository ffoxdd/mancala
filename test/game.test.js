const {assertThat, hasProperties, is} = require('hamjest')
const { OrderedMap } = require('immutable')
const Game = require("../lib/game")
const Board = require("../lib/board")
const BoardPosition = require("../lib/board_position")

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

            board: hasProperties({
                hand: is(0),

                description: is(
                    "A0:2,A1:0,A2:0,A3:0,A4:0,A5:0,AM:1," +
                    "B0:1,B1:1,B2:1,B3:1,B4:1,B5:1,BM:0"
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

    test("captures opponent stones", () => {
        let game = new Game({})

        game = game.playTurn(5)
        game = game.playTurn(2)
        game = game.playTurn(1)

        assertThat(game, hasProperties({
            currentPlayer: is("B"),

            board: hasProperties({
                hand: is(0),

                description: is(
                    "A0:5,A1:0,A2:5,A3:5,A4:5,A5:0,AM:7," +
                    "B0:0,B1:5,B2:0,B3:5,B4:5,B5:5,BM:1"
                )
            }),
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
        assertThat(nextGame,  is(game))
    })
})
