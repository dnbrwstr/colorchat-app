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

@interface RCTPlaceholderMessage : RCTViewManager
@end

@implementation RCTPlaceholderMessage

RCT_EXPORT_MODULE()

- (UIView *)view
{
  UIView *view = [[UIView alloc] init];
  UIView *dot = [[UIView alloc] init];
  [view addSubview:dot];
  dot.autoresizingMask = (UIViewAutoresizingFlexibleLeftMargin   |
                          UIViewAutoresizingFlexibleRightMargin  |
                          UIViewAutoresizingFlexibleTopMargin    |
                          UIViewAutoresizingFlexibleBottomMargin);
  return view;
}

@end