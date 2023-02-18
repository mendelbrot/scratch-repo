package max.greg.com.gregsapp1;

public class MacroSquare {

    public StarSystem starSystem;
    public Integer starShip;

    MacroSquare() {}

    MacroSquare(StarSystem starSystem) {
        this.starSystem = starSystem;
    }

    public void placeStarSystem(StarSystem starSystem) {
        this.starSystem = starSystem;
    }

    public void placeStarShip(int starShip) {
        this.starShip = starShip;
    }
}
