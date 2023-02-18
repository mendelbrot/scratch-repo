class MathUtil {

    static constants = {
        G: 6.67408 * Math.pow(10, -11),
        marsSunDistance: 2.279 * Math.pow(10, 11),      // meters
        marsAngularSpeed: 1.059 * Math.pow(10, -7),     // radians per second
        marsMass: 6.417 * Math.pow(10, 23),             // kg
        sunMass: 1.98855 * Math.pow(10, 30),            // kg
    };

    static convertPolarToCartesian = (polarPosition) => {

        return [polarPosition[0] * Math.cos(polarPosition[1]), polarPosition[0] * Math.sin(polarPosition[1])];
    }

    static convertPolarVelocityToCartesian = (polarVelocity, polarPosition) => {

        return [
            polarVelocity[0] * Math.cos(polarPosition[1]) - polarPosition[0] * polarVelocity[1] * Math.sin(polarPosition[1]),
            polarVelocity[0] * Math.sin(polarPosition[1]) + polarPosition[0] * polarVelocity[1] * Math.cos(polarPosition[1])
        ]
    }

    // for when you want to find the cartesian velocity, given the polar velocity and cartesian position
    static convertPolarVToCartAtCartP = (polarV, cartP) => {

        let r = this.magnitudeVectorDifference(cartP, [0, 0]);

        return [
            polarV[0] * cartP[0] / r - polarV[1] * cartP[1],
            polarV[0] * cartP[1] / r + polarV[1] * cartP[0]
        ]
    }

    static vectorSum = (A1, A2) => {
        return A1.map((element, index) => {
            return element + A2[index];
        });
    }

    static multiplyNumberVector = (s, A) => {
        return A.map((element) => {
            return s * element;
        });
    }

    static magnitudeVectorDifference = (A1, A2) => {
        let normSquared = 0;
        A1.forEach((element, index) => {
            normSquared += (element - A2[index]) ** 2;
        });
        return Math.sqrt(normSquared);
    }

    // calculates the accelleration of each object due to gravitational force from all the other objects
    // if indexList is specified then only update the accellerations at those indices
    static updateAccelleration = (simObjectsList, indexList) => {

        if (!indexList) {
            indexList = simObjectsList.map((element, index) => {
                return index;
            });
        }

        indexList.forEach((currentIndex) => {
            var currentObject = simObjectsList[currentIndex];
            currentObject.accelleration = [0, 0];
            simObjectsList.forEach((element, index) => {
                if (index !== currentIndex) {
                    currentObject.accelleration[0] +=
                        this.constants.G
                        * element.mass
                        * (element.position[0] - currentObject.position[0])
                        * Math.pow(
                            Math.pow(element.position[0] - currentObject.position[0], 2)
                            + Math.pow(element.position[1] - currentObject.position[1], 2),
                            -3 / 2
                        );
                    currentObject.accelleration[1] +=
                        this.constants.G
                        * element.mass
                        * (element.position[1] - currentObject.position[1])
                        * Math.pow(
                            Math.pow(element.position[0] - currentObject.position[0], 2)
                            + Math.pow(element.position[1] - currentObject.position[1], 2),
                            -3 / 2
                        );
                };
            });
        });
    }

    static calculateMaxDistance = (simObjectsList, min) => {
        let maxDistance = min;  // min is the minimum output
        simObjectsList.forEach((object) => {
            let distance = this.magnitudeVectorDifference(object.position, [0, 0]);
            if (distance > maxDistance) {
                maxDistance = distance;
            }
        });
        return maxDistance;
    }

    static SimObjectTemplate = {
        position: [0, 0],
        velocity: [0, 0],
        accelleration: [0, 0],
        mass: 0,
    }
}
export default MathUtil;