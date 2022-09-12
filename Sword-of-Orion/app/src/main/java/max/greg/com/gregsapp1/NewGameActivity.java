package max.greg.com.gregsapp1;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.SeekBar;


public class NewGameActivity extends AppCompatActivity {

    final int STARS_OFFSET = 8;
    final int PLANETS_OFFSET = 1;
    SeekBar starsBar;
    SeekBar planetsBar;
    int stars = 10;
    int planets = 4;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_new_game);

        getSupportActionBar().setTitle("New Game");

        // puts in a back arrow
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        SeekBar starsBar = findViewById(R.id.stars);
        SeekBar planetsBar = findViewById(R.id.planets);

        stars = STARS_OFFSET + starsBar.getProgress();
        planets = PLANETS_OFFSET + planetsBar.getProgress();

        if (starsBar != null) {
            starsBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
                @Override
                public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                }

                @Override
                public void onStartTrackingTouch(SeekBar seekBar) {
                }

                @Override
                public void onStopTrackingTouch(SeekBar seekBar) {
                    // Write code to perform some action when touch is stopped.
                    stars = STARS_OFFSET + seekBar.getProgress();
                }
            });
        }
        if (planetsBar != null) {
            planetsBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
                @Override
                public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                }

                @Override
                public void onStartTrackingTouch(SeekBar seekBar) {
                }

                @Override
                public void onStopTrackingTouch(SeekBar seekBar) {
                    // Write code to perform some action when touch is stopped.
                    planets = PLANETS_OFFSET + seekBar.getProgress();
                }
            });
        }
    }

    // back action
    @Override
    public boolean onSupportNavigateUp(){
        finish();
        return true;
    }

    public void startNewGame(final View view) {

        Intent startNewGameIntent = new Intent(this, GameMacroViewActivity.class);
        startNewGameIntent.putExtra("stars", stars);
        startNewGameIntent.putExtra("planets", planets);
        startActivity(startNewGameIntent);
    }
}
