//
//  ColorChat_Message.h
//  ColorChat
//
//  Created by Daniel Brewster on 11/6/15.
//

#import <Realm/Realm.h>

@interface ChatMessage : RLMObject

@property (nonatomic, strong) NSString *id;
@property (nonatomic, strong) NSNumber<RLMInt> *senderId;
@property (nonatomic, strong) NSNumber<RLMInt> *recipientId;
@property (nonatomic, strong) NSDate *createdAt;
@property (nonatomic, strong) NSString *color;
@property (nonatomic, strong) NSNumber<RLMInt> *width;
@property (nonatomic, strong) NSNumber<RLMInt> *height;
@property (nonatomic, strong) NSString *state;

- (NSDictionary *) toDict;

@end
