package max.greg.com.gregsapp1;

import android.content.Intent;
import android.graphics.LightingColorFilter;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    private Button newGameButton;
    private Button savedGamesButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        getSupportActionBar().hide(); //hide the title bar

        newGameButton = findViewById(R.id.newGameButton);
        savedGamesButton = findViewById(R.id.savedGamesButton);

        // set button click effect
        // https://stackoverflow.com/questions/35398499/set-button-click-effect-in-android
        // also had to use the onTouchListener to handle click action due to interference
        // between onTouch and onClick listeners
        View.OnTouchListener buttonTouchListener = new View.OnTouchListener() {
            public boolean onTouch (View v, MotionEvent event) {
                if (event.getAction() == MotionEvent.ACTION_DOWN) {
                    v.getBackground().setColorFilter(new LightingColorFilter(0xFFFFFFFF, 0xFF800080));
                }
                if (event.getAction() == MotionEvent.ACTION_UP) {
                    v.getBackground().setColorFilter(null);

                    //perform button action on click release
                    switch(v.getId()){
                        case R.id.newGameButton:
                            newGame(v);
                            break;
                        case R.id.savedGamesButton:
                            savedGames(v);
                            break;
                    }
                }
                return true;
            }
        };
        newGameButton.setOnTouchListener(buttonTouchListener);
        savedGamesButton.setOnTouchListener(buttonTouchListener);
    }

    public void newGame(final View view) {

        startActivity(new Intent(this, NewGameActivity.class));
    }
    public void savedGames(final View view) {

        startActivity(new Intent(this, SavedGamesActivity.class));
    }


}
