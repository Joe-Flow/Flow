import React, { useEffect, useState } from 'react';
import {
  Text, StatusBar, View, StyleSheet,
  Platform, TouchableOpacity, Image, Button, NativeModules,
  requireNativeComponent
} from 'react-native';

import Sound from 'react-native-sound'

// const { VoiceChangingModule } = NativeModules;
import VoiceStuff from './VoiceStuff'

const { VoiceChangingModule } = NativeModules;
// const CounterView = requireNativeComponent("CounterView")

console.log(Platform.OS, "NATIVE =-=- MODULES", NativeModules, VoiceChangingModule,)

// VoiceChangingModule.getCount(val => console.log(val, 'val'))

// console.log(NativeModules.Counter)

// NativeModules.Counter.increment()

// console.log(NativeModules.Counter, '?')

// NativeModules.Counter.getCount(value => {
//   console.log("count is " + value)
// })


const App = () => {
  const audioTrackURL = 'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3';
  // const [isPlaying, setIsPlaying] = useState(false)
  // const [song, setSong] = useState({})

  const changeToAlein = () => {
    console.log(Platform.OS, VoiceChangingModule)
    Platform.OS === 'android'
      ? VoiceChangingModule.changeVoiceToAlien(audioTrackURL)
      : VoiceChangingModule.changeVoiceToAlien(res => console.log(res, '????'))
  };

  const changeToChild = () => {
    Platform.OS === 'android'
      ? VoiceChangingModule.changeVoiceToChild(audioTrackURL)
      : VoiceChangingModule.changeVoiceToChild();
  };

  const changeToFast = () => {
    Platform.OS === 'android'
      ? VoiceChangingModule.speedUpVoice(audioTrackURL)
      : VoiceChangingModule.speedUpVoice();
  };

  const changeToSlow = () => {
    Platform.OS === 'android'
      ? VoiceChangingModule.slowDownVoice(audioTrackURL)
      : VoiceChangingModule.slowDownVoice();
  };


  // const playTrack = () => {
  //   console.log('play', isPlaying)
  //   Sound.setCategory('Playback');
  //   if (!isPlaying) {


  //     // Load the sound file 'whoosh.mp3' from the app bundle
  //     // See notes below about preloading sounds within initialization code below.
  //     var whoosh = new Sound(audioTrackURL, '', (error) => {
  //       if (error) {
  //         console.log('failed to load the sound', error);
  //         return;
  //       }
  //       // loaded successfully
  //       console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());


  //       // Play the sound with an onEnd callback
  //       whoosh.play((success) => {
  //         if (success) {
  //           console.log('successfully finished playing');
  //         } else {
  //           console.log('playback failed due to audio decoding errors');
  //         }
  //       });
  //     });
  //     setSong(whoosh)
  //   } else {
  //     song.stop()
  //   }

  //   setIsPlaying(!isPlaying)
  // }


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={'#e4e5ea'} />
      {/* <Button title="Play" onPress={playTrack} /> */}

      {/* <CounterView style={styles.wrapper} />

      <TouchableOpacity onPress={() => changeToAlein()}>
        <Image
          source={{
            uri:
              'https://icons.iconarchive.com/icons/google/noto-emoji-smileys/256/10101-alien-icon.png',
          }}
          resizeMode={'contain'}
          style={styles.icon}
        /><Text>WTF</Text>
      </TouchableOpacity> */}

      <VoiceStuff />

      {/* <Text style={styles.title}>Voice Changer</Text>
      <Text style={styles.title}> Change Voice Effects </Text>
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => changeToAlein()}>
          <Image
            source={{
              uri:
                'https://icons.iconarchive.com/icons/google/noto-emoji-smileys/256/10101-alien-icon.png',
            }}
            resizeMode={'contain'}
            style={styles.icon}
          />
          <Text>Alien</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeToChild()}>
          <Image
            source={{
              uri:
                'https://pics.freeicons.io/uploads/icons/png/2793494581535699799-512.png',
            }}
            resizeMode={'contain'}
            style={styles.icon}
          />
          <Text>Child</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeToFast()}>
          <Image
            source={{
              uri:
                'https://www.pngjoy.com/pngl/346/6457386_black-arrows-fast-forward-symbol-transparent-png-download.png',
            }}
            resizeMode={'contain'}
            style={styles.icon}
          />
          <Text>Fast</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeToSlow()}>
          <Image
            source={{
              uri:
                'https://img.pngio.com/action-motion-play-slow-icon-slow-motion-png-512_512.png',
            }}
            resizeMode={'contain'}
            style={styles.icon}
          />
          <Text>Slow</Text>
        </TouchableOpacity> 
    </View>*/}
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e4e5ea',
    flex: 1,
    width: '100%',
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#000',
    marginVertical: 25,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 50,
  },
  warningText: {
    color: 'red',
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  spacing: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    height: 40,
    width: 40,
    marginBottom: 15,
  },
  // container: {
  //   flex: 1, alignItems: "stretch"
  // },
  // wrapper: {
  //   flex: 1, alignItems: "center", justifyContent: "center"
  // },
  // border: {
  //   borderColor: "#eee", borderBottomWidth: 1
  // },
  // button: {
  //   fontSize: 50, color: "orange"
  // }
});

export default App;

