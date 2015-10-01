#import "AppDelegate.h"
#import <Parse/Parse.h>
#import "RCTRootView.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [NSURL URLWithString:@"http://192.168.1.5:8081/js/index.ios.bundle?dev=false&platform=ios"];

  // jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];

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

  return YES;
}

-(void)setupParse {
  NSString *path = [[NSBundle mainBundle] pathForResource:@"Parse" ofType:@"plist"];
  NSDictionary *parseCreds = [NSDictionary dictionaryWithContentsOfFile:path];
  [Parse setApplicationId:[parseCreds objectForKey:@"Application ID"] clientKey:[parseCreds objectForKey:@"Client Key"]];
}

-(void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [RCTPushNotificationManager application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  NSLog(@"GOT HERE");
  PFInstallation *currentInstallation = [PFInstallation currentInstallation];
  [currentInstallation setDeviceTokenFromData:deviceToken];
  currentInstallation.channels = @[ @"global" ];
  [currentInstallation saveInBackground];
}

@end
