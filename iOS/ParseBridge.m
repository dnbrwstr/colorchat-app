//
//  ParseBridge.m
//  ColorChat
//
//  Created by Daniel Brewster on 12/10/15.
//

#import <Foundation/Foundation.h>
#import "ParseBridge.h"
#import <Parse/Parse.h>

@implementation ParseBridge

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(setBadgeCount:(NSInteger)count)
{
  PFInstallation *currentInstallation = [PFInstallation currentInstallation];
  [currentInstallation setBadge:count];
  [currentInstallation saveInBackground];
}

@end
