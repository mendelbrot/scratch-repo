package max.greg.com.gregsapp1;

import android.content.Intent;
import android.graphics.Point;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Display;
import android.view.View;
import android.widget.AdapterView;
import android.widget.GridView;
import android.widget.Toast;

import java.io.Serializable;

public class MicroViewActivity extends AppCompatActivity {

    GridView microGameGrid;
    Intent fromParent;
    StarSystem thisSystem;
    int microGridSquares[];

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_micro_view);

        getSupportActionBar().setTitle(null);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        this.fromParent = getIntent();
        //thisSystem = gameMap.//(fromParent.getIntExtra("stars", 5), fromParent.getIntExtra("planets", 2));
        int[] thisSystem = fromParent.getExtras().getIntArray("starSystem");
        microGameGrid = findViewById(R.id.gridView);
        microGameGrid.setNumColumns(3);
        Display display = getWindowManager().getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        int screenWidth = size.x;
        double widthDenominator = 3.0;
        microGameGrid.setColumnWidth((int)(screenWidth/widthDenominator));

        ImageAdapter microGridAdapter = new ImageAdapter(getApplicationContext(), thisSystem, widthDenominator);
        microGameGrid.setAdapter(microGridAdapter);

//        microGameGrid.setOnItemClickListener(new AdapterView.OnItemClickListener() {
//            public void onItemClick(AdapterView<?> parent, View v, int position, long id) {
//
//                Toast.makeText(MicroViewActivity.this, Integer.toString(intent.getIntExtra("players", 0)), Toast.LENGTH_LONG).show();
//
//            }
//        });
    }

    // back action
    @Override
    public boolean onSupportNavigateUp(){
        finish();
        return true;
    }


//    //fake data for grid squares
//    int a = R.drawable.galaxy;
//    int microGridSquares[] = {
//            a, a, a,
//            a, a, a,
//            a, a, a,
//    };
}
