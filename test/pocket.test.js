const Pocket = require("../lib/pocket")

describe("#add", () => {
    test("adds stones", () => {
        let pocket = new Pocket(4)
        pocket.add(3)
        expect(pocket.stones).toBe(7)
    })
})

describe("#remove", () => {
    test("removes stones", () => {
        let pocket = new Pocket(4)
        pocket.remove(3)
        expect(pocket.stones).toBe(1)
    })
})

describe("#isEmpty", () => {
    test("returns true if there are no stones", () => {
        expect((new Pocket(4)).isEmpty()).toBeFalse()
        expect((new Pocket(0)).isEmpty()).toBeTrue()
    })
})
