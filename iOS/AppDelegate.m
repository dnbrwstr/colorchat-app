#import "AppDelegate.h"
#import <Parse/Parse.h>
#import "RCTRootView.h"
#import "DatabaseManager.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [NSURL URLWithString:@"http://192.168.1.5:8081/index.ios.bundle?dev=true&platform=ios"];

//  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"ColorChat"
                                               initialProperties: nil
                                                   launchOptions:launchOptions];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [self setupParse];
  [DatabaseManager runMigrations];
  
  return YES;
}

-(void)setupParse {
  NSString *path = [[NSBundle mainBundle] pathForResource:@"Parse" ofType:@"plist"];
  NSDictionary *parseCreds = [NSDictionary dictionaryWithContentsOfFile:path];
  [Parse setApplicationId:[parseCreds objectForKey:@"Application ID"] clientKey:[parseCreds objectForKey:@"Client Key"]];
}

-(void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [RCTPushNotificationManager application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  PFInstallation *currentInstallation = [PFInstallation currentInstallation];
  [currentInstallation setDeviceTokenFromData:deviceToken];
  currentInstallation.channels = @[ @"global" ];
  [currentInstallation saveInBackground];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(nonnull NSError *)error {
  NSLog(@"%@",[error localizedDescription]);
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
  [RCTPushNotificationManager application:application didReceiveRemoteNotification:notification];
}

@end
