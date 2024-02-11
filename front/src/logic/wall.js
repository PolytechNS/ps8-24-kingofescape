class Wall {
    constructor(coordinate1, coordinate4, isVertical) {
        console.log(coordinate1, coordinate4, isVertical);
        if (coordinate1.x !== (coordinate4.x - 1) && coordinate1.y !== (coordinate4.y - 1)) {
            console.log(coordinate1.x, coordinate4.x, coordinate1.y, coordinate4.y);
            throw new Error("Les coordonnées ne sont pas alignées");
        }

        this.coordinate1 = coordinate1;
        this.coordinate4 = coordinate4;
        this.isVertical = isVertical;
    }
}

export {Wall};