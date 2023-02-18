package max.greg.com.gregsapp1;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Adapter;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.BaseAdapter;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.PopupMenu;
import android.widget.TextView;
import android.widget.ImageButton;
import android.widget.Toast;
import java.util.ArrayList;
import android.os.Bundle;
import java.util.Arrays;
import java.util.stream.Collectors;

public class ListAdapter extends BaseAdapter {
    Context context;
    ArrayList<String> textList;
    ArrayList<Integer> iconList;
    LayoutInflater inflter;
    DBAdapter db;

    public ListAdapter(Context applicationContext, String[] textList, Integer[] iconList) {
        this.context = applicationContext;
        this.textList = new ArrayList<>(Arrays.asList(textList));
        this.iconList = new ArrayList<>(Arrays.asList(iconList));
        inflter = (LayoutInflater.from(applicationContext));

        db = new DBAdapter(context);

    }

    @Override
    public int getCount() {
        return textList.size();
    }

    @Override
    public Object getItem(int i) {
        return 0;
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        final int index = i;
        view = inflter.inflate(R.layout.activity_listview, null);
        TextView text = view.findViewById(R.id.textView);
        ImageView icon = view.findViewById(R.id.imageView);
        text.setText(textList.get(i));
        icon.setImageResource(iconList.get(i));

        ImageButton optionsButton = view.findViewById(R.id.optionsButton);

        optionsButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                //System.out.println(textList[index]);
                db.open();
                //System.out.println(db.getMap(textList.get(index)).getString(0));
                //db.deleteGame(textList[index]);
                db.close();
                PopupMenu options = new PopupMenu(context, v);
                options.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
                    @Override
                    public boolean onMenuItemClick(MenuItem item) {
                        int id = item.getItemId();
                        switch(id) {
                            case R.id.deleteGameButton:
                                ListAdapter.this.removeAndRefresh(index);
                                return true;
                            default:
                                return false;
                        }
                    }
                });
                MenuInflater inflater = options.getMenuInflater();
                inflater.inflate(R.menu.list_options_menu, options.getMenu());
                options.show();
            }
        });

        icon.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                startSelectedGame(textList.get(index));
            }
        });

        text.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                startSelectedGame(textList.get(index));
            }
        });

        return view;
    }

    public void startSelectedGame(String saveName) {

        Intent loadGameIntent = new Intent(context, GameMacroViewActivity.class);
        loadGameIntent.putExtra("saveName", saveName);
        loadGameIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(loadGameIntent);
    }

    public void removeAndRefresh(int index){
        db.open();
        db.deleteGame(textList.get(index));
        db.close();
        textList.remove(index);
        iconList.remove(index);
        notifyDataSetChanged();
    }
}
