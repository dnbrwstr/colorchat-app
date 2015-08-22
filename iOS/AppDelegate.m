#import "AppDelegate.h"
#import <Parse/Parse.h>
#import "RCTRootView.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [NSURL URLWithString:@"http://192.168.1.5:8081/js/index.ios.bundle"];

  // jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"ColorChat"
                                                   launchOptions:launchOptions];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [self setupParse];
  
  UIUserNotificationType userNotificationTypes = (UIUserNotificationTypeAlert |
                                                  UIUserNotificationTypeBadge |
                                                  UIUserNotificationTypeSound);
  
  UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes: userNotificationTypes
                                                                         categories: nil];
  [application registerUserNotificationSettings:settings];
  [application registerForRemoteNotifications];
  
  return YES;
}

-(void)setupParse {
  NSString *path = [[NSBundle mainBundle] pathForResource:@"animals" ofType:@"plist"];
  NSDictionary *parseCreds = [NSDictionary dictionaryWithContentsOfFile:path];
  [Parse setApplicationId:[parseCreds objectForKey:@"Application ID"] clientKey:[parseCreds objectForKey:@"Client Key"]];
}

-(void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  PFInstallation *currentInstallation = [PFInstallation currentInstallation];
  [currentInstallation setDeviceTokenFromData:deviceToken];
  currentInstallation.channels = @[ @"global" ];
  [currentInstallation saveInBackground];
}

@end
