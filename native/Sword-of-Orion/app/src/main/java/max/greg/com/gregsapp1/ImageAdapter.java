package max.greg.com.gregsapp1;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.util.DisplayMetrics;

public class ImageAdapter extends BaseAdapter {

    Context context;
    int imageIDs[];
    double widthDenominator;
    LayoutInflater inflater;

    public ImageAdapter(Context context, int[] imageIDs, double widthDenominator) {
        this.context = context;
        this.imageIDs = imageIDs;
        this.inflater = LayoutInflater.from(context);
        this.widthDenominator = widthDenominator;
    }

    @Override
    public int getCount() {
        return imageIDs.length;
    }

    @Override
    public Object getItem(int i) {
        return null;
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        DisplayMetrics metrics = viewGroup.getResources().getDisplayMetrics();
        int screenWidth = metrics.widthPixels;
        view = inflater.inflate(R.layout.activity_imageview, null);
        ImageView image = view.findViewById(R.id.image);
        image.getLayoutParams().width = (int)(screenWidth/this.widthDenominator);
        image.getLayoutParams().height = (int)(screenWidth/this.widthDenominator);
        image.setPadding(16, 16, 16, 16);
        image.setImageResource(imageIDs[i]);
        return view;
    }

    public void refresh(int[] newImageIDs) {

        this.imageIDs = newImageIDs;
        notifyDataSetChanged();
    }

}
