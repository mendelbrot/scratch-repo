package max.greg.com.gregsapp1;

import android.database.Cursor;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.GridView;
import android.widget.Toast;

public class SavedGamesActivity extends AppCompatActivity {

    ListView savedGamesListView;

    String games[];
    final int SHIP_ICON = R.drawable.enterprise;
    Integer icons[];
    int numGames;
    DBAdapter db;
    Cursor cursor;
    ListAdapter listAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_saved_games);
        getSupportActionBar().setTitle("Saved Games");
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        db = new DBAdapter(this);

        db.open();
        cursor = db.getAllSaves();
        numGames = cursor.getCount();
        games = new String[numGames];
        icons = new Integer[numGames];
        if (cursor.moveToFirst()) {

            for (int i = 0; i < numGames; i++) {
                games[i] = cursor.getString(0);
                icons[i] = SHIP_ICON;
                cursor.moveToNext();
            }
        }
        db.close();


        savedGamesListView = findViewById(R.id.savedGamesListView);
        listAdapter = new ListAdapter(getApplicationContext(), games, icons);
        savedGamesListView.setAdapter(listAdapter);
    }

    // back action
    @Override
    public boolean onSupportNavigateUp(){
        finish();
        return true;
    }
}
