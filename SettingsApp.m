//
//  SettingsApp.m
//  ColorChat
//
//  Created by Daniel Brewster on 10/7/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import "SettingsApp.h"

@implementation SettingsApp

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(openSettings)
{
  if (UIApplicationOpenSettingsURLString != NULL) {
    [[UIApplication sharedApplication] openURL: [NSURL URLWithString:UIApplicationOpenSettingsURLString]];
  }
}

@end
