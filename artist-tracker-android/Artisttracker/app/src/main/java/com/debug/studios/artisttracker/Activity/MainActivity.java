package com.debug.studios.artisttracker.Activity;

import android.content.Intent;
import android.content.IntentFilter;
import android.net.wifi.aware.PublishConfig;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.FrameLayout;


import com.debug.studios.artisttracker.Fragments.HomeFragment;
import com.debug.studios.artisttracker.Fragments.LoginFragment;
import com.debug.studios.artisttracker.R;
import com.github.kittinunf.fuel.Fuel;
import com.github.kittinunf.fuel.core.FuelError;
import com.github.kittinunf.fuel.core.Handler;
import com.github.kittinunf.fuel.core.Request;
import com.github.kittinunf.fuel.core.Response;
import com.mikepenz.materialdrawer.AccountHeader;
import com.mikepenz.materialdrawer.AccountHeaderBuilder;
import com.mikepenz.materialdrawer.Drawer;
import com.mikepenz.materialdrawer.DrawerBuilder;
import com.mikepenz.materialdrawer.model.DividerDrawerItem;
import com.mikepenz.materialdrawer.model.PrimaryDrawerItem;
import com.mikepenz.materialdrawer.model.ProfileDrawerItem;
import com.mikepenz.materialdrawer.model.SecondaryDrawerItem;
import com.mikepenz.materialdrawer.model.interfaces.IDrawerItem;
import com.mikepenz.materialdrawer.model.interfaces.IProfile;


public class MainActivity extends AppCompatActivity{
    public ViewPager viewPager;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar myToolbar = findViewById(R.id.my_toolbar);
        setSupportActionBar(myToolbar);
        viewPager = findViewById(R.id.viewpager);




        // Navigation Drawer
        final PrimaryDrawerItem item1 = new PrimaryDrawerItem().withIdentifier(1).withName("HOME");
        SecondaryDrawerItem item2 = new SecondaryDrawerItem().withIdentifier(2).withName("SIGN IN");
        SecondaryDrawerItem item3 = new SecondaryDrawerItem().withIdentifier(3).withName("SIGN UP");
        SecondaryDrawerItem item4 = new SecondaryDrawerItem().withIdentifier(4).withName("ABOUT US");



        AccountHeader headerResult = new AccountHeaderBuilder()
                .withActivity(this)
                .withHeaderBackground(R.drawable.abstract_image)
                .addProfiles(
                        new ProfileDrawerItem().withName("Ayush Bahuguna").withEmail("ab@gmail.com").withIcon(getResources().getDrawable(R.drawable.ic_action_name)
                        ))
                .withOnAccountHeaderListener(new AccountHeader.OnAccountHeaderListener() {
                    @Override
                    public boolean onProfileChanged(View view, IProfile profile, boolean currentProfile) {
                        return false;
                    }
                })
                .build();
        //Builed Drawer and add to the Activity
        final Drawer result = new DrawerBuilder().withAccountHeader(headerResult)
                .withActivity(this)
                .withToolbar(myToolbar)
                .addDrawerItems(
                        item1,
                        new DividerDrawerItem(),
                        item2,
                        new SecondaryDrawerItem().withName("SIGN IN"),
                        item3,
                        new SecondaryDrawerItem().withName("SIGN UP"),
                        item4,
                        new SecondaryDrawerItem().withName("ABOUT US")
                )
                .withOnDrawerItemClickListener(new Drawer.OnDrawerItemClickListener() {


                    @Override
                    public boolean onItemClick(View view, int position, IDrawerItem drawerItem) {
                        if (drawerItem != null){
                            Intent intent = null;
                            if (drawerItem.getIdentifier()==1){
                                intent = new Intent(MainActivity.this,HomeFragment.class);
                            }else if (drawerItem.getIdentifier()== 2){
                                intent = new Intent(MainActivity.this,LoginFragment.class);
                            }

                            if (intent != null){
                                MainActivity.this.startActivity(intent);
                            }
                        }


                        return false;
                    }
                })
                .build();

/*
        result.getActionBarDrawerToggle().setDrawerIndicatorEnabled(false);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        getSupportActionBar().setDisplayHomeAsUpEnabled(false);
        result.getActionBarDrawerToggle().setDrawerIndicatorEnabled(true);
        */

    }



}
