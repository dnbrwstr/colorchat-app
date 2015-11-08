//
//  DatabaseManager.m
//  ColorChat
//
//  Created by Daniel Brewster on 11/6/15.
//

#import <Foundation/Foundation.h>
#import "DatabaseManager.h"
#import "RCTLog.h"
#import "RCTConvert.h"

@implementation DatabaseManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(storeMessage:(NSDictionary *)messageData callback:(RCTResponseSenderBlock)callback)
{
  // Convert props as necessary
  // Transform date string to actual date so we can sort on it
  NSDate *createdAt = [RCTConvert NSDate: messageData[@"createdAt"]];
  // Realm chokes if underlying NSNumber value is not an int
  NSNumber *senderId = [NSNumber numberWithInt:[messageData[@"senderId"] intValue]];
  NSNumber *recipientId = [NSNumber numberWithInt:[messageData[@"recipientId"] intValue]];
  NSNumber *width = [NSNumber numberWithInt:[messageData[@"width"] intValue]];
  NSNumber *height = [NSNumber numberWithInt:[messageData[@"height"] intValue]];
  
  NSDictionary *props = [NSDictionary dictionaryWithObjectsAndKeys:
          messageData[@"id"], @"id",
          recipientId, @"recipientId",
          senderId, @"senderId",
          createdAt, @"createdAt",
          messageData[@"color"], @"color",
          width, @"width",
          height, @"height", nil];
  
  ChatMessage *message = [[ChatMessage alloc] initWithValue: props];
  
  // Save message
  RLMRealm *realm = RLMRealm.defaultRealm;
  NSError *error;

  [realm beginWriteTransaction];
  [realm addObject:message];
  [realm commitWriteTransaction:&error];
  
  // Execute callback
  if (error) {
    NSString *errorMessage = [error localizedDescription];
    NSLog([error userInfo]);
    callback(@[errorMessage]);
  } else {
//    NSLog(@"Stored %@", [message toDict]);
    callback(@[@false, [message toDict]]);
  }
}

RCT_EXPORT_METHOD(
                  loadMessagesForContact:(nonnull NSNumber *)contactId
                  page:(nonnull NSNumber *)page
                  per:(nonnull NSNumber *)per
                  callback:(RCTResponseSenderBlock)callback
                  )
{
  NSString *queryString = [NSString stringWithFormat:@"recipientId = %@ OR senderId = %@", contactId, contactId];
  RLMResults *messages = [[ChatMessage objectsWhere:queryString]
                          sortedResultsUsingProperty: @"createdAt" ascending:NO];
  NSMutableArray *resultsArray = [NSMutableArray arrayWithCapacity:[per integerValue]];
  
  int start = [page doubleValue] * [per doubleValue];
  int end = start + [per doubleValue];
  
  NSLog(@"%d %d", start, end);
  
  for (int i = start; i < end; ++i) {
    if (i < [messages count]) {
      NSDictionary *dict = [[messages objectAtIndex:(NSUInteger)i] toDict];
      [resultsArray addObject:dict];
    } else {
      break;
    }
  }
//  NSLog(@"Retrieved %@", resultsArray);
  callback(@[@false, resultsArray, [NSNumber numberWithInt:[messages count]]]);
};

- (NSDictionary *)objectToDictionary:(RLMObject *)object
{
  NSDictionary *dict = [[NSDictionary alloc] init];
  return dict;
}


@end