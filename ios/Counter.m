//
//  Counter.m
//  FlowBridge
//
//  Created by niko on 12/4/21.
//

#import <Foundation/Foundation.h>


#import "React/RCTBridgeModule.h"
@interface RCT_EXTERN_MODULE(Counter, NSObject)

RCT_EXTERN_METHOD(increment)
RCT_EXTERN_METHOD(getCount: (RCTResponseSenderBlock)callback)

@end


