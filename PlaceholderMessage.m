//
//  PlaceholderMessage.m
//  ColorChat
//
//  Created by Daniel Brewster on 11/5/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "PlaceholderMessage.h"

@implementation PlaceholderMessage

- (id)init
{
  self = [super init];
  [self createDot];
  return self;
}

- (void)createDot
{
  UIView *dot = [[UIView alloc] initWithFrame: CGRectMake(0.0, 0.0, 10, 10)];
  dot.backgroundColor = [UIColor colorWithRed:50.0 green:50.0 blue:50.0 alpha:255.0];
  [self addSubview:dot];
  self.dot = dot;
  [self animateIn];
}

- (void)animateIn
{
  CGRect dotFrame = self.dot.frame;
  dotFrame.origin.x = 50;
  
  [UIView animateWithDuration:0.5
                        delay:0.0
                      options:UIViewAnimationOptionAutoreverse | UIViewAnimationOptionRepeat | UIViewAnimationOptionCurveEaseInOut
                   animations:^{
                     // do whatever animation you want, e.g.,
                     
                     self.dot.frame = dotFrame;
                   }
                   completion:NULL];
}

- (void)animateOut
{
  CGRect dotFrame = self.dot.frame;
  dotFrame.origin.x = 50;
  
  [UIView beginAnimations:nil context:nil];
  [UIView setAnimationDuration:0.5];
  [UIView setAnimationDelay:1.0];
  [UIView setAnimationCurve:UIViewAnimationCurveEaseInOut];
  
  self.dot.frame = dotFrame;
  
  [UIView commitAnimations];
  [self animateIn];
}

@end