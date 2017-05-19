//
//  DatabaseManager.m
//  ColorChat
//
//  Created by Daniel Brewster on 11/6/15.
//

#import <Foundation/Foundation.h>
#import "DatabaseManager.h"
#import <React/RCTLog.h>
#import <React/RCTConvert.h>

@implementation DatabaseManager

RCT_EXPORT_MODULE();

+(void)runMigrations
{
  RLMRealmConfiguration *config = [RLMRealmConfiguration defaultConfiguration];
  config.schemaVersion = 3;
  config.migrationBlock = ^(RLMMigration *migration, uint64_t oldSchemaVersion) {
    NSMutableArray *seenIds = [[NSMutableArray alloc] init];

    [migration enumerateObjects:ChatMessage.className
                          block:^(RLMObject *oldObject, RLMObject *newObject) {
                            if (oldSchemaVersion < 1) {
                              newObject[@"state"] = @"complete";
                            }
                            
                            if (oldSchemaVersion < 2) {
                              NSNumber *width = oldObject[@"width"];
                              NSNumber *height = oldObject[@"height"];
                              
                              if (width.intValue == 0 && height.intValue == 0) {
                                newObject[@"width"] = [NSNumber numberWithInt:240];
                                newObject[@"height"] = [NSNumber numberWithInt:150];
                              }
                            }
                            
                            if (oldSchemaVersion < 3) {
                              if ([seenIds containsObject: oldObject[@"id"]]) {
                                [migration deleteObject: newObject];
                              } else {
                                [seenIds addObject:oldObject[@"id"]];
                              }
                            }

                          }];
  };
  [RLMRealmConfiguration setDefaultConfiguration:config];
}

RCT_EXPORT_METHOD(storeMessage:(NSDictionary *)messageData callback:(RCTResponseSenderBlock)callback)
{
  // Return if message already exists in database
  NSString *queryString = [NSString stringWithFormat:@"id = '%@'", messageData[@"id"]];
  RLMResults *messages = [ChatMessage objectsWhere:queryString];
  if (messages.count > 0) {
    return callback(@[@"Message already exists"]);
  }

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
          messageData[@"state"], @"state",
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
  NSMutableArray *freshArray = [[NSMutableArray alloc] init];
  
  int start = [page doubleValue] * [per doubleValue];
  int end = start + [per doubleValue];
  
  NSLog(@"%d %d", start, end);
  
  for (int i = start; i < end; ++i) {
    if (i < [messages count]) {
      ChatMessage *message = [messages objectAtIndex:(NSUInteger)i];
      NSDictionary *dict = [message toDict];
      [resultsArray addObject:dict];
      
      if ([message.state isEqual: @"fresh"]) {
        [freshArray addObject:message];
      }
    } else {
      break;
    }
  }
//  NSLog(@"Retrieved %@", resultsArray);
  callback(@[@false, resultsArray, [NSNumber numberWithInt:[messages count]]]);
  
  // Mark messages read after they've been retrieved
  RLMRealm *realm = RLMRealm.defaultRealm;
  [realm beginWriteTransaction];
  for (int i = 0; i < [freshArray count]; ++i) {
    ChatMessage *message = [freshArray objectAtIndex:i];
    message.state = @"complete";
  }
  [realm commitWriteTransaction];
};

RCT_EXPORT_METHOD(getUnreadCount:(RCTResponseSenderBlock)callback)
{
  NSString *queryString = @"state = 'fresh'";
  RLMResults *messages = [ChatMessage objectsWhere:queryString];
  NSNumber *count = [NSNumber numberWithInt:[messages count]];
  callback(@[@false, count]);
}

RCT_EXPORT_METHOD(purgeMessages:(RCTResponseSenderBlock)callback)
{
  RLMRealm *realm = RLMRealm.defaultRealm;
  NSError *error;
  
  [realm beginWriteTransaction];
  [realm deleteAllObjects];
  [realm commitWriteTransaction:&error];
  
  if (error) {
    NSString *errorMessage = [error localizedDescription];
    NSLog([error userInfo]);
    callback(@[errorMessage]);
  } else {
    callback(@[@false]);
  }
}

@end
