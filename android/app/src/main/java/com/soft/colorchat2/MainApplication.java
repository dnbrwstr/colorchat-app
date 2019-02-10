package com.soft.colorchat2;

import android.app.Application;
import com.facebook.react.ReactApplication;
import io.invertase.firebase.RNFirebasePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import io.invertase.firebase.RNFirebasePackage;
import com.tkporter.sendsms.SendSMSPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.realm.react.RealmReactPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFirebasePackage(),
            new RNDeviceInfo(),
          SendSMSPackage.getInstance(),
          new RealmReactPackage(),
          new ReactNativeContacts(),
          new RNFirebaseMessagingPackage(),
          new RNFirebaseNotificationsPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
