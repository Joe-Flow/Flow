//
//  CounterViewManager.swift
//  FlowBridge
//
//  Created by niko on 12/7/21.
//

import Foundation


@objc(CounterViewManager)
class CounterViewManager: RCTViewManager {
//  override func view() -> UIView! {
//    let label = UILabel()
//    label.text = "Swift Counter"
//    label.textAlignment = .center
//    return label
//  }
  override func view() -> UIView! {
    return CounterView()
//    return AudioPowerVisualizerView()
  }

//  override func view() -> UIView! {
//    return Content()
//  }


  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  

}
