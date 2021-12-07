import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View, ScrollView } from "react-native";
// import SoundPlayer from 'react-native-sound-player'
// import TrackPlayer from 'react-native-track-player';
import Sound from 'react-native-sound'

import Voice, {
    SpeechResultsEvent,
    SpeechErrorEvent,
    SpeechRecognizedEvent,
    SpeechEndEvent
} from "@react-native-voice/voice";

export default function App() {
    console.log('does this get reset somehow?')
    // const [results, setResults] = useState([] as string[]);

    const audioTrackURL = 'https://previews.customer.envatousercontent.com/files/207000702/preview.mp3' //'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3' //`https://previews.customer.envatousercontent.com/files/207000702/preview.mp3` //'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3';

    const [isPlaying, setIsPlaying] = useState(false)
    const [song, setSong] = useState({})
    const [isListening, setIsListening] = useState(false);

    async function onSpeechEnd(e: SpeechEndEvent) {

    }


    async function onSpeechRecognized(e: SpeechRecognizedEvent) {
        console.log(e, ' recognized!!')

    }


    async function onSpeechPartialResults(e: SpeechResultsEvent) {
        // console.log(e.value, ' SpeechPartialResultsEvent')
    }



    function onSpeechError(e: SpeechErrorEvent) {
        console.log(e, '000');
    }


    async function toggleListening() {
        console.log(isListening, '??!!=-=-=-==-?', Voice.start)
        let services = await Voice.getSpeechRecognitionServices();
        console.log(services);
        try {
            if (isListening) {
                await Voice.stop();
                // SoundPlayer.stop()
                setIsListening(false);
            } else {
                // setResults([]);
                await Voice.start("en-US");
                // start();

                // await SoundPlayer.playSoundFile('https://www.w3schools.com/tags/horse.mp3', 'mp3')
                setIsListening(true);
            }
        } catch (e) {
            console.error(e);
        }


    }

    const playTrack = () => {
        console.log('play', isPlaying)
        toggleListening()
        Sound.setCategory('Playback');
        if (!isPlaying) {


            // Load the sound file 'whoosh.mp3' from the app bundle
            // See notes below about preloading sounds within initialization code below.
            var whoosh = new Sound(audioTrackURL, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                    return;
                }
                // loaded successfully
                console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());


                // Play the sound with an onEnd callback
                whoosh.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            });
            setSong(whoosh)
        } else {
            song.stop()
        }

        setIsPlaying(!isPlaying)
    }



    return (
        <View style={{ width: '100%' }} >
            <View>

                <Button title="Play" onPress={playTrack} />


            </View>

            <ShowLyrics />
        </View>
    );
}


// function Listen() {
//     const [isListening, setIsListening] = useState(false);

//     async function toggleListening() {
//         console.log(isListening, '??!!=-=-=-==-?', Voice.start)
//         let services = await Voice.getSpeechRecognitionServices();
//         console.log(services);
//         try {
//             if (isListening) {
//                 await Voice.stop();
//                 // SoundPlayer.stop()
//                 setIsListening(false);
//             } else {
//                 // setResults([]);
//                 await Voice.start("en-US");
//                 // start();

//                 // await SoundPlayer.playSoundFile('https://www.w3schools.com/tags/horse.mp3', 'mp3')
//                 setIsListening(true);
//             }
//         } catch (e) {
//             console.error(e);
//         }


//     }

//     return (<Button
//         title={isListening ? "Stop Recognizing" : "Start Recognizing"}
//         onPress={toggleListening}

//     />)
// }



// [
//     {
//         word: 'blah',
//         rhymes: [ 'ma', 'pa', 'haha']
//     },


// ]
function findRhyme({ word }) {

    return fetch(`https://api.datamuse.com/words?rel_rhy=${word}`)
        .then(res => res.json())
        .then(results => {
            return results.slice(0, 5)
        })
        .catch(console.error)
}


function ShowLyrics() {
    console.log('show')
    const [lyrics, setLyrics] = useState([]);
    const [verse, setVerse] = useState([] as string[])

    useEffect(() => {
        console.log("uno")
        Voice.onSpeechResults = onSpeechResults;
        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, [])

    async function onSpeechResults(e: SpeechResultsEvent) {

        //[Knock, Knock]
        //[Knock, Knock, Who's, there]

        let words = e.value[0].split(' ')
        let newLyrics = []
        for (let word of words) {
            let rhymes = await findRhyme({ word })
            console.log(rhymes, '.')
            newLyrics.push({ word, rhymes })
        }
        setLyrics(newLyrics)
        // let words = e.value[0].split(' ').map(word => ({ word: word, rhymes: [] }))
        // console.log(words, 'results', lyrics)

        // setLyrics(words)
        // setVerse(words)

    }

    console.log(lyrics, ' -=-=-=-=-')
    return (

        <View>

            <ScrollView style={{
                padding: 5,
                backgroundColor: 'white',
                zIndex: 10, display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                // direction: 'rtl',
                transform: [{ rotate: '180deg' }],
            }}
                contentContainerStyle={{ flexDirection: 'row' }}
            >
                <View style={{
                    transform: [{ rotate: '180deg' }],
                    display: 'flex',
                    // alignItems: 'flex-end',
                    flexDirection: 'row',
                    padding: 10

                }}>
                    {lyrics.map((word, i) => {
                        return (


                            <Text style={{ display: 'flex', flexDirection: 'row' }} key={`word-${i}`}>
                                {word.word + ' '}
                            </Text>

                        )
                    })}
                </View>
            </ScrollView>
            <View style={{
                backgroundColor: '#eee',
                width: '100%',
                // height: '100%',
                // marginTop: '33%',
                height: 500,
                display: 'flex',
                position: 'absolute',
                // top: 50,
                // left: 20,
                paddingBottom: 150,
                justifyContent: 'center',
                alignItems: 'center'

                // alignItems: 'center'
            }}>
                <ScrollView
                    style={{
                        display: 'flex',
                        // flexDirection: 'row',
                        // flexWrap: 'wrap',
                        height: 200,
                        // justifyContent: 'space-around',
                        zIndex: -1,
                        margin: 'auto',
                        width: '100%',
                        // alignItems: 'center',
                        // position: 'absolute',
                        // left: 0,
                        transform: [{ rotate: '180deg' }],
                        direction: 'rtl',
                        overflow: 'scroll'
                        // right: 0,
                        // bottom: '50%'
                    }}
                // contentContainerStyle={{ justifyContent: 'space-around', alignItems: 'flex-start' }}
                >
                    <View style={{
                        overflow: 'hidden',
                        transform: [{ rotate: '180deg' }]
                    }}>
                        {lyrics.map((word, i) => {
                            return (

                                <View style={{ margin: 5, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>


                                    <Text style={{ flexWrap: 'nowrap', flexDirection: 'row', display: 'flex', fontSize: 16, overflow: 'hidden' }} key={`word-${i}`}>
                                        {word.word + ' '}
                                    </Text>
                                    <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', overflow: 'hidden', width: '100%' }}>
                                        {word.rhymes.map(rhyme => <Text style={{ fontSize: 11, color: '#888' }}> {rhyme.word} </Text>)}
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView >
            </View>
        </View>
    )
}



{/* <ScrollView
style={{ flex: 1 }}
contentContainerStyle={styles.scrollview}
scrollEnabled={scrollEnabled}
onContentSizeChange={this.onContentSizeChange}
>
<View style={styles.content}></View>
</ScrollView> */}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
});



// const start = async () => {
//     // Set up the player
//     await TrackPlayer.setupPlayer();

//     // Add a track to the queue
//     await TrackPlayer.add({
//         id: 'trackId',
//         url: `https://www.chosic.com/wp-content/uploads/2021/07/The-Epic-Hero-Epic-Cinematic-Keys-of-Moon-Music.mp3`, //require('track.mp3'),
//         title: 'Track Title',
//         artist: 'Track Artist',
//         // artwork: require('track.png')
//     });

//     // Start playing it
//     await TrackPlayer.play();
// };
