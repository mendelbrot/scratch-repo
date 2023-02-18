package max.greg.com.gregsapp1;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

public class DBAdapter {

    //various constants to be used in creating and updating the database
    static final String KEY_ROWID = "_id";
    static final String TAG = "DBAdapter";

    static final String DATABASE_NAME = "SwordOfOrion";
    static final int DATABASE_VERSION = 3;
    static final String CREATE_GAME_MAPS =
            "create table game_maps (_id integer primary key autoincrement, "
                    + "save_name text not null, "
                    + "num_stars int not null, "
                    + "num_planets int not null);";
    static final String CREATE_MACRO_SQUARES =
            "create table macro_squares (_id integer primary key autoincrement, "
                    + "save_name text not null, "
                    + "map_index int not null, "
                    + "system_id int, "
                    + "ship_image int);";
    static final String CREATE_SYSTEMS =
            "create table systems (_id integer primary key autoincrement, "
                    + "save_name text not null, "
                    + "star int, "
                    + "index_0 int, "
                    + "index_1 int, "
                    + "index_2 int, "
                    + "index_3 int, "
                    + "index_4 int, "
                    + "index_5 int, "
                    + "index_6 int, "
                    + "index_7 int, "
                    + "index_8 int);";

    final Context context;


    private DatabaseHelper dbHelper;
    private SQLiteDatabase db;

    public DBAdapter(Context ctx)
    {
        this.context = ctx;
        dbHelper = new DatabaseHelper(context);
    }

    private static class DatabaseHelper extends SQLiteOpenHelper
    {
        public DatabaseHelper(Context context)
        {
            super(context, DATABASE_NAME, null, DATABASE_VERSION);
        }

        //onCreate implicitly used to create the database table "contacts"
        @Override
        public void onCreate(SQLiteDatabase db)
        {
            try {
                db.execSQL(CREATE_GAME_MAPS);
                db.execSQL(CREATE_MACRO_SQUARES);
                db.execSQL(CREATE_SYSTEMS);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        //onUpgrade called implicitly when the database "version" has changed
        @Override
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion)
        {
            Log.w(TAG, "Upgrading database from version " + oldVersion + " to "
                    + newVersion + ", which will destroy all old data");
            //db.execSQL("DROP TABLE IF EXISTS saves");
            db.execSQL("DROP TABLE IF EXISTS game_maps");
            db.execSQL("DROP TABLE IF EXISTS macro_squares");
            db.execSQL("DROP TABLE IF EXISTS systems");
            onCreate(db);
        }
    }

    //---opens the database---
    //calls SQLiteOpenHelper.getWritableDatabase() when opening the DB.
    //If the DB does not yet exist it will be created here.
    public DBAdapter open() throws SQLException
    {
        db = dbHelper.getWritableDatabase();
        return this;
    }

    //---closes the database---
    public void close()
    {
        dbHelper.close();
    }

    //---insert a contact into the database---
    //uses ContentValues class to store key/value pairs for field names and data
    //to be inserted into the DB table by SQLiteDatabase.insert()
    public void saveGame(String saveName, GameMap gameMap)
    {
        ContentValues gameMapValues = new ContentValues();
        gameMapValues.put("save_name", saveName);
        gameMapValues.put("num_stars", gameMap.numStars);
        gameMapValues.put("num_planets", gameMap.totalNumPlanets);
        db.insert("game_maps", null, gameMapValues);

        for (int i=0; i<gameMap.macroSquares.length; i++) {
            MacroSquare macroSquare = gameMap.macroSquares[i];
            ContentValues macroSquareValues = new ContentValues();
            macroSquareValues.put("save_name", saveName);
            macroSquareValues.put("map_index", i);
            if(macroSquare.starSystem != null){

                StarSystem system = macroSquare.starSystem;
                ContentValues systemValues = new ContentValues();
                systemValues.put("save_name", saveName);
                systemValues.put("star", system.star);
                systemValues.put("index_4", system.star);
                if(system.squares[0] != null) {
                    systemValues.put("index_0", system.squares[0]);
                }
                if(system.squares[1] != null) {
                    systemValues.put("index_1", system.squares[1]);
                }
                if(system.squares[2] != null) {
                    systemValues.put("index_2", system.squares[2]);
                }
                if(system.squares[3] != null) {
                    systemValues.put("index_3", system.squares[3]);
                }
                if(system.squares[5] != null) {
                    systemValues.put("index_5", system.squares[5]);
                }
                if(system.squares[6] != null) {
                    systemValues.put("index_6", system.squares[6]);
                }
                if(system.squares[7] != null) {
                    systemValues.put("index_7", system.squares[7]);
                }
                if(system.squares[8] != null) {
                    systemValues.put("index_8", system.squares[8]);
                }
                db.insert("systems", null, systemValues);

                Cursor c = db.query(true, "systems", new String[] {"_id"},
                "save_name" + "=" + "'"+saveName+"'", null,
                null, null, null, null);
                c.moveToLast();
                int starSystemId = c.getInt(0);
                macroSquareValues.put("system_id", starSystemId);
            }
            if(macroSquare.starShip != null) {
                macroSquareValues.put("ship_image", macroSquare.starShip);
            }
            db.insert("macro_squares", null, macroSquareValues);
        }

        return;
    }

    //---deletes a particular contact---
    //removes from the DB the record specified using SQLiteDatabase.delete()
    public void deleteGame(String saveName)
    {
        db.delete("game_maps", "save_name" + "=" + "'"+saveName+"'", null);
        db.delete("macro_squares", "save_name" + "=" + "'"+saveName+"'", null);
        db.delete("systems", "save_name" + "=" + "'"+saveName+"'", null);
        return;
    }

    //---retrieves all the games---
    //SQLiteDatabase.query builds a SELECT query and returns a "Cursor" over the result set
    public Cursor getAllSaves()
    {
        return db.query("game_maps", new String[] {"save_name", "num_stars", "num_planets"},
                null, null, null, null, null);
    }

    //---retrieves a particular map---
    public GameMap getMap(String saveName) throws SQLException
    {
        GameMap gameMap;

        Cursor mapCursor =
                db.query(true, "game_maps", new String[] {"num_stars", "num_planets"},
                        "save_name" + "=" + "'"+saveName+"'", null,
                        null, null, null, null);
        mapCursor.moveToFirst();

        gameMap = new GameMap(mapCursor.getInt(0));

        gameMap.numStars = mapCursor.getInt(0);
        gameMap.totalNumPlanets = mapCursor.getInt(1);

        Cursor macroSquareCursor =
                db.query(true, "macro_squares", new String[]{"map_index", "system_id", "ship_image"},
                        "save_name" + "=" + "'" + saveName + "'", null,
                        null, null, null, null);
        for (int i = 0; i < gameMap.NUM_MACRO_SQUARES; i++) {
            macroSquareCursor.moveToPosition(i);
            int index = macroSquareCursor.getInt(0);
            int systemIndex = 0;
            if (!macroSquareCursor.isNull(1)) {
                int systemId = macroSquareCursor.getInt(1);

                Cursor systemCursor =
                        db.query(true, "systems", new String[]{
                                "star", "index_0", "index_1", "index_2", "index_3", "index_4",
                                "index_5", "index_6", "index_7", "index_8",},
                                "_id" + "=" + "'"+systemId+"'", null,
                                null, null, null, null);
                systemCursor.moveToFirst();
                StarSystem system = new StarSystem(systemIndex);
                system.placeStar(systemCursor.getInt(0));
                system.squares = new Integer[] {
                        !systemCursor.isNull(1) ? systemCursor.getInt(1): null,
                        !systemCursor.isNull(2) ? systemCursor.getInt(2): null,
                        !systemCursor.isNull(3) ? systemCursor.getInt(3): null,
                        !systemCursor.isNull(4) ? systemCursor.getInt(4): null,
                        !systemCursor.isNull(5) ? systemCursor.getInt(5): null,
                        !systemCursor.isNull(6) ? systemCursor.getInt(6): null,
                        !systemCursor.isNull(7) ? systemCursor.getInt(7): null,
                        !systemCursor.isNull(8) ? systemCursor.getInt(8): null,
                        !systemCursor.isNull(9) ? systemCursor.getInt(9): null
                };
                gameMap.starSystems[systemIndex] = system;
                gameMap.macroSquares[index].starSystem = gameMap.starSystems[systemIndex];
                systemIndex++;
            } else if (!macroSquareCursor.isNull(2)) {
                gameMap.macroSquares[index].starShip = macroSquareCursor.getInt(2);
            }
        }
        return gameMap;
    }

    //---updates a contact---
    //Uses SQLiteDatabase.update() to change existing data by key/value pairs
    public boolean updateMap(String saveName, GameMap gameMap)
    {
        ContentValues args = new ContentValues();
        args.put("save_name", saveName);
        args.put("num_stars", gameMap.numStars);
        args.put("num_planets", gameMap.totalNumPlanets);
        return db.update("game_maps", args, "save_name" + "=" + "'"+saveName+"'", null) > 0;
    }
}
