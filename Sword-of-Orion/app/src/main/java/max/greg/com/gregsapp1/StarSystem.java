package max.greg.com.gregsapp1;

public class StarSystem {

    public Integer index;
    public Integer star;
    public Integer squares[];

//    StarSystem() {
//        squares = new Integer[GameMap.NUM_MICRO_SQUARES];
//    }

    StarSystem(int index) {
        this.index = index;
        squares = new Integer[GameMap.NUM_MICRO_SQUARES];
    }

    public void placeStar(int star) {
        this.star = star;
        squares[4] = star;
    }

    public int[] getStarSystemImages() {
        int[] gridImages = new int[GameMap.NUM_MICRO_SQUARES];

        for (int i = 0; i< GameMap.NUM_MICRO_SQUARES; i++) {
            if (this.squares[i] != null) {
                gridImages[i] = this.squares[i];
            } else {
                gridImages[i] = 0;
            }
        }
        return gridImages;
    }
}
