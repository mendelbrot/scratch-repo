package max.greg.com.gregsapp1;

import java.util.Random;

public class MathRepo {

    Random rand;

    MathRepo() {
        rand = new Random();
    }

    public boolean getRandomOutcome (int numerator, int denominator) {
        return rand.nextFloat() < 1.0*numerator/denominator;
    }

    // returns a list of n random numbers between 0 and m-1 inclusive
    // Algorithm R
    // https://en.wikipedia.org/wiki/Reservoir_sampling
    public int[] chooseNRandomOfM (int n, int m) {

        int[] r = new int[n];

        for (int i=0; i<n; i++) {
            r[i] = i;
        }

        int j;
        for (int i=n; i<m; i++) {
            j = chooseRandomNumber(0, i-1);
            if (j < n) {
                r[j] = i;
            }
        }

        return r;

//        int amountLeftToChoose = n-1;
//        int amountLeftInPile = m;
//        int currentNumber = 0;
//        int[] nRandomNumbersOutput = new int[n];
//        int index = 0;
//        while (amountLeftToChoose > 0) {
//            if (getRandomOutcome(amountLeftToChoose, amountLeftInPile)) {
//                nRandomNumbersOutput[index] = currentNumber;
//                index++;
//                amountLeftToChoose--;
//            }
//            currentNumber++;
//            amountLeftInPile--;
//        }
//        return nRandomNumbersOutput;

//        //fake output for testing
//        int[] testOutput = new int[n];
//        for (int i=0; i<n; i++) {
//            testOutput[i] = i;
//        }
//        return testOutput;
//        return new int[] {0,2,4,6,8,10,12,14,16, 18};
    }

    public int chooseRandomIndex(int length) {
        return rand.nextInt(length);
    }

    public int chooseRandomNumber(int min, int max) {
        return min + rand.nextInt(max - min + 1);
    }
}
