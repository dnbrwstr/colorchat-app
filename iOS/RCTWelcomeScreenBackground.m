//
//  RCTWelcomeScreenBackground.m
//  ColorChat
//
//  Created by Daniel Brewster on 11/24/15.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "RCTViewManager.h"
#import "WelcomeScreenBackground.h"

@interface RCTWelcomeScreenBackground : RCTViewManager
@end

@implementation RCTWelcomeScreenBackground

RCT_EXPORT_MODULE()

- (UIView *)view
{
    UIView *view = [[WelcomeScreenBackground alloc] init];
    return view;
}


@end