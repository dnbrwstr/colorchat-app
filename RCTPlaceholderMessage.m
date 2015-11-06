//
//  RCTPlaceholderMessage.m
//  ColorChat
//
//  Created by Daniel Brewster on 11/5/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "RCTViewManager.h"
#import "PlaceholderMessage.h"

@interface RCTPlaceholderMessage : RCTViewManager
@end

@implementation RCTPlaceholderMessage

RCT_EXPORT_MODULE()

- (UIView *)view
{
  UIView *view = [[PlaceholderMessage alloc] init];
  return view;
}


@end