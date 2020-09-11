class Pocket {
    constructor(stones) {
        this.stones = stones
    }

    add(count) {
        this.stones += count
    }

    remove(count) {
        this.stones -= count
    }

    isEmpty() {
        return this.stones == 0
    }
}

module.exports = Pocket
