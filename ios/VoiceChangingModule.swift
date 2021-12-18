//
//  VoiceChangerModule.swift
//  FlowBridge
//
//  Created by niko on 12/4/21.
//

import Foundation
import AVFoundation

@objc(VoiceChangingModule)
class VoiceChangingModule: NSObject {
  
  var player: AVAudioPlayer?
  
  var engine: AVAudioEngine!
  var file: AVAudioFile!
  var audioFile: AVAudioFile!
  
  @objc
  func changeVoiceToAlien() {
    print("ALIENs")
    
    engine = AVAudioEngine()
    guard let url = Bundle.main.url(forResource: "song", withExtension: "mp3") else { return }
    do {
      try self.audioFile = AVAudioFile(forReading: url)
      if let format = AVAudioFormat(commonFormat: .pcmFormatFloat32, sampleRate: file.fileFormat.sampleRate, channels: 1, interleaved: false) {
              if let buf = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: 1024) {
                  try! file.read(into: buf)

                  // this makes a copy, you might not want that
                  let floatArray = UnsafeBufferPointer(start: buf.floatChannelData![0], count:Int(buf.frameLength))
                  // convert to data
                  var data = Data()
                  for buf in floatArray {
                      data.append(withUnsafeBytes(of: buf) { Data($0) })
                  }
                print("datadatadata")
                print(data)
                

                
                
                
                  // use the data if required.
              }
          }
      
      
    } catch {
      print("Error in audioFile")
    }
    
    
    playModifiedSound(value: -1000, rateOrPitch: "pitch")
  }
  
  
  @objc
  func getCount(_ callback: RCTResponseSenderBlock) {
                  callback([
                    "count",               // variable
                    123.9,               // int or float
                    "third argument",    // string
                    [1, 2.2, "3"],       // array
                    ["a": 1, "b": 2]     // object
                  ])
              }
  
  @objc
  func changeVoiceToChild() {
    print("ALIENs")

    engine = AVAudioEngine()
    guard let url = Bundle.main.url(forResource: "song", withExtension: "mp3") else { return }
    do {
      try self.audioFile = AVAudioFile(forReading: url)
    } catch {
      print("Error in audioFile")
    }
    playModifiedSound(value: 1500, rateOrPitch: "pitch")
  }
  
  @objc
  func speedUpVoice() {
    engine = AVAudioEngine()
    guard let url = Bundle.main.url(forResource: "song", withExtension: "mp3") else { return }
    do {
      try self.audioFile = AVAudioFile(forReading: url)
    } catch {
      print("Error in audioFile")
    }
    playModifiedSound(value: 1.5, rateOrPitch: "rate")
  }
  
  @objc
  func slowDownVoice() {
    engine = AVAudioEngine()
    guard let url = Bundle.main.url(forResource: "song", withExtension: "mp3") else { return }
    do {
      try self.audioFile = AVAudioFile(forReading: url)
    } catch {
      print("Error in audioFile")
    }
    playModifiedSound(value: 0.5, rateOrPitch: "rate")
  }
  
  func playModifiedSound(value: Float, rateOrPitch: String){
          let audioPlayerNode = AVAudioPlayerNode()
          
          audioPlayerNode.stop()
          engine.stop()
          engine.reset()
          
          engine.attach(audioPlayerNode)
          
          let changeAudioUnitTime = AVAudioUnitTimePitch()
          
          if (rateOrPitch == "rate") {
              changeAudioUnitTime.rate = value
          } else {
              changeAudioUnitTime.pitch = value
          }
          
          engine.attach(changeAudioUnitTime)
          engine.connect(audioPlayerNode, to: changeAudioUnitTime, format: nil)
          engine.connect(changeAudioUnitTime, to: engine.outputNode, format: nil)
          audioPlayerNode.scheduleFile(audioFile, at: nil, completionHandler: nil)
          do {
            try engine.start()
          } catch {
            print("Error")
          }
          
          audioPlayerNode.play()
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
