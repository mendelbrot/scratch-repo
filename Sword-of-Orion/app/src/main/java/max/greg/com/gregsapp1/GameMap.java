package max.greg.com.gregsapp1;

import java.util.ArrayList;
import java.util.List;

public class GameMap {

    public final int NUM_MACRO_SQUARES = 24;
    public static final int NUM_MICRO_SQUARES = 9;
    public final int PLANETS[] = {
            R.drawable.earth,
            R.drawable.europa,
            R.drawable.jupiter,
            R.drawable.mars,
            R.drawable.moon,
            R.drawable.saturn,
            R.drawable.titan,
    };
    public final int SUNS[] = {
            R.drawable.blue,
            R.drawable.purple,
            R.drawable.red,
            R.drawable.yellow,
    };
    public MacroSquare macroSquares[];
    public StarSystem starSystems[];
    public int numStars;
    public int totalNumPlanets;
    public int maxPlanetsPerStar;
    public MathRepo repo;

    GameMap(int numStars) {

        this.numStars = numStars;

        repo = new MathRepo();
        macroSquares = new MacroSquare[NUM_MACRO_SQUARES];
        for (int i = 0; i < macroSquares.length; i++) {
            macroSquares[i] = new MacroSquare();
        }
        starSystems = new StarSystem[numStars];
        for (int i = 0; i < starSystems.length; i++) {
            starSystems[i] = new StarSystem(i);
            starSystems[i].index = i;
        }
    }

    GameMap(int numStars, int maxPlanetsPerStar) {

        this.numStars = numStars;
        this.totalNumPlanets = 0;
        this.maxPlanetsPerStar = maxPlanetsPerStar;

        repo = new MathRepo();
        macroSquares = new MacroSquare[NUM_MACRO_SQUARES];
        for (int i = 0; i < macroSquares.length; i++) {
            macroSquares[i] = new MacroSquare();
        }
        starSystems = new StarSystem[numStars];
        for (int i = 0; i < starSystems.length; i++) {
            starSystems[i] = new StarSystem(i);
            starSystems[i].index = i;
        }

        placeStarSystems();
        placePlanets();
        placeEnterprise();
    }

    /////////////////////
    // utility methods //
    /////////////////////

    public int[] getMacroGridImages() {
        int[] gridImages = new int[NUM_MACRO_SQUARES];

        for (int i = 0; i < NUM_MACRO_SQUARES; i++) {
            if (macroSquares[i].starSystem != null) {
                gridImages[i] = macroSquares[i].starSystem.star;
            } else if (macroSquares[i].starShip != null) {
                gridImages[i] = macroSquares[i].starShip;
            } else {
                gridImages[i] = 0;
            }
        }
        return gridImages;
    }

    /////////////////////////////
    //  map generation methods //
    /////////////////////////////

    public void placeStarSystems() {
        int[] selectedSquares = repo.chooseNRandomOfM(numStars, NUM_MACRO_SQUARES);

        for (int i = 0; i < numStars; i++) {
            int selectedSquare = selectedSquares[i];
            int sun = SUNS[repo.chooseRandomIndex(SUNS.length)];
            starSystems[i].placeStar(sun);
            macroSquares[selectedSquare].placeStarSystem(starSystems[i]);
        }
    }

    public void placePlanets() {
        int numPlanets;
        for (int i = 0; i < numStars; i++) {
            numPlanets = repo.chooseRandomNumber(0, maxPlanetsPerStar);
            totalNumPlanets += numPlanets;
            if (numPlanets > 0) {
                int[] selectedSquares = repo.chooseNRandomOfM(numPlanets, NUM_MICRO_SQUARES - 1);
                //subtracted 1 above because we're skipping the center square which is the sun

                for (int j = 0; j < numPlanets; j++) {
                    int selectedSquare = selectedSquares[j];
                    // skip over square 4 which is the sun
                    if (selectedSquare >= 4) {
                        selectedSquare++;
                    }
                    int planet = PLANETS[repo.chooseRandomIndex(PLANETS.length)];
                    starSystems[i].squares[selectedSquare] = planet;
                }
            }
        }
    }

    public void placeEnterprise() {

        boolean hasPlacedEnterprise = false;
        int index;
        while (!hasPlacedEnterprise) {
            index = repo.chooseRandomIndex(NUM_MACRO_SQUARES);
            if (macroSquares[index].starSystem == null && macroSquares[index].starShip == null) {
                macroSquares[index].placeStarShip(R.drawable.enterprise);
                hasPlacedEnterprise = true;
            }
        }
    }
}