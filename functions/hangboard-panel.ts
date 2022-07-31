/**
 *
 * @param baseCoord base coordinate.
 * @param base base line width or height.
 * @param scaleTo line width or height to scale to.
 * @returns the new coordinate position relative to base position.
 */

export const positionPin = (baseCoord: number, base: number, scaleTo: number) => {

    const diff = (scaleTo / base) * 100;

    const newCoord = (baseCoord / 100) * diff;

    return newCoord;
}

export const imageAspectRatio = (width: number, height: number) => {

    let antecedent, consequent, largestNumber;

    largestNumber = width > height ? width : height;

    antecedent = width / largestNumber;

    consequent = height / largestNumber;

    return antecedent / consequent;
}
