//
//  ColorChat_Message.m
//  ColorChat
//
//  Created by Daniel Brewster on 11/6/15.
//

#import "ChatMessage.h"

@implementation ChatMessage

- (NSDictionary *) toDict
{
  return [NSDictionary dictionaryWithObjectsAndKeys:
          self.id, @"id",
          (NSNumber *)self.recipientId, @"recipientId",
          (NSNumber *)self.senderId, @"senderId",
          [self getDateAsString], @"createdAt",
          self.color, @"color",
          (NSNumber *)self.width, @"width",
          (NSNumber *)self.height, @"height",
          self.state, @"state",
          nil];
}

- (NSString *) getDateAsString
{
  NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
  NSLocale *enUSPOSIXLocale = [NSLocale localeWithLocaleIdentifier:@"en_US_POSIX"];
  [dateFormatter setLocale:enUSPOSIXLocale];
  [dateFormatter setDateFormat:@"yyyy-MM-dd'T'HH:mm:ssZZZZZ"];
  
  return [dateFormatter stringFromDate:self.createdAt];
}

@end
