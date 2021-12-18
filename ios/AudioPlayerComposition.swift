//
//  AudioPlayerComposition.swift
//  FlowBridge
//
//  Created by niko on 12/7/21.
//

import Foundation

//
import UIKit
import AVFoundation

class AudioPlayerComposition {

    private var player: AVAudioPlayer
    private weak var view: AudioPowerVisualizerView!

    init(player: AVAudioPlayer, view: AudioPowerVisualizerView) {
        self.player = player
        self.view = view
        player.isMeteringEnabled = true
        view.player = player
    }

    // Start audio playing, view updates
    func play() {
        guard !player.isPlaying else {
            return
        }

        player.play()
        view.start()
    }

    // Pause audio playing, stop view updates
    func pause() {
        guard player.isPlaying else {
            return
        }

        player.pause()
        view.stop()
    }

    // Stop audio playing, stop view updates
    func stop() {
        guard player.isPlaying else {
            return
        }

        player.stop()
        view.stop()
    }

}
