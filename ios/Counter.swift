//
//  Counter.swift
//  FlowBridge
//
//  Created by niko on 12/4/21.
//

import Foundation


import Foundation
@objc(Counter)
class Counter: NSObject {
  @objc
   func constantsToExport() -> [AnyHashable : Any]! {
     return [
       "number": 123.9,
       "string": "foo",
       "boolean": true,
       "array": [1, 22.2, "33"],
       "object": ["a": 1, "b": 2]
     ]
   }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  private var count = 0
  @objc
  func increment() {
    count += 1
    print("count is \(count)")
  }
  
  @objc
    func getCount(_ callback: RCTResponseSenderBlock) {
      callback([
        count,               // variable
        123.9,               // int or float
        "third argument",    // string
        [1, 2.2, "3"],       // array
        ["a": 1, "b": 2]     // object
      ])
    }

  
}
