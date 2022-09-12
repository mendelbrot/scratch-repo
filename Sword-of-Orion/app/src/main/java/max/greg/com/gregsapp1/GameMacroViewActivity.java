package max.greg.com.gregsapp1;

import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Point;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.text.InputType;
import android.view.Display;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.GridView;
import android.app.AlertDialog;
import android.widget.TextView;
import android.widget.EditText;

import java.io.Serializable;

public class GameMacroViewActivity extends AppCompatActivity implements Serializable {

    GridView macroGameGrid;
    Intent fromParent;
    public GameMap gameMap;
    int macroGridSquares[];
    String saveName = "";
    DBAdapter db;
    ImageAdapter macroGridAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_game_macro_view);
        getSupportActionBar().setTitle(null);
        db = new DBAdapter(this);
        fromParent = getIntent();
        String save = fromParent.getStringExtra("saveName");
        if (save != null && !save.isEmpty()) {
            db.open();
            gameMap = db.getMap(save);
            db.close();
            this.saveName = save;
        } else {
            gameMap = new GameMap(fromParent.getIntExtra("stars", 5), fromParent.getIntExtra("planets", 2));
        }
        macroGridSquares = gameMap.getMacroGridImages();

        macroGameGrid = findViewById(R.id.gridView);
        macroGameGrid.setNumColumns(4);
        Display display = getWindowManager().getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        int screenWidth = size.x;
        double widthDenominator = 4.2;
        macroGameGrid.setColumnWidth((int)(screenWidth/widthDenominator));

        macroGridAdapter = new ImageAdapter(getApplicationContext(), macroGridSquares, widthDenominator);
        macroGameGrid.setAdapter(macroGridAdapter);

        macroGameGrid.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            public void onItemClick(AdapterView<?> parent, View v, int position, long id) {
                MacroSquare selectedSquare = gameMap.macroSquares[position];
                int[] selectedSystemImages;
                if (selectedSquare.starSystem != null) {
                    selectedSystemImages = selectedSquare.starSystem.getStarSystemImages();
                    Intent intent = new Intent(GameMacroViewActivity.this, MicroViewActivity.class);
                    intent.putExtra("starSystem", selectedSystemImages);

                    startActivityForResult(intent, 0);
                } else if (selectedSquare.starShip != null) {

                    //randomly jump the starship when tapped
                    gameMap.placeEnterprise();
                    selectedSquare.starShip = null;
                    macroGridSquares = gameMap.getMacroGridImages();
                    refreshView(macroGridSquares);
                }

            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu)
    {
        menu.setGroupDividerEnabled(true);

        getMenuInflater().inflate(
                R.menu.game_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.saveGameButton:

                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                builder.setTitle("Save As");

                final EditText input = new EditText(this);
                input.setText(saveName);
                builder.setView(input);
                builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        saveName = input.getText().toString();
                        db.open();
                        db.deleteGame(saveName);
                        db.saveGame(saveName, gameMap);
                        db.close();
                    }
                });
                builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.cancel();
                    }
                });
                builder.show();
                break;
            case R.id.exitGameButton:
                Intent exitGameIntent = new Intent(this, MainActivity.class);
                startActivity(exitGameIntent);
                break;
            default:
                return super.onOptionsItemSelected(item);
        }
    return true;
    }

    public void refreshView(int[] newImages) {
        macroGridAdapter.refresh(newImages);
    }
}
