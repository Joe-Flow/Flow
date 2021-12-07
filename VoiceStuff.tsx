import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View, ScrollView } from "react-native";
// import SoundPlayer from 'react-native-sound-player'
// import TrackPlayer from 'react-native-track-player';

import Voice, {
    SpeechResultsEvent,
    SpeechErrorEvent,
    SpeechRecognizedEvent,
    SpeechEndEvent
} from "@react-native-voice/voice";

export default function App() {
    console.log('does this get reset somehow?')
    // const [results, setResults] = useState([] as string[]);



    // const [rhymes, setRhymes] = useState([] as string[])
    // useEffect(() => {

    //     Voice.onSpeechError = onSpeechError;
    //     // Voice.onSpeechResults = onSpeechResults;
    //     Voice.onSpeechPartialResults = onSpeechPartialResults;
    //     Voice.onSpeechRecognized = onSpeechRecognized
    //     Voice.onSpeechEnd = onSpeechEnd;
    //     return () => {
    //         Voice.destroy().then(Voice.removeAllListeners);
    //     };
    // }, []);


    // console.log(verse, lyrics, ' y not')
    async function onSpeechEnd(e: SpeechEndEvent) {
        // console.log(e, 'end', lyrics, verse)
        // setLyrics([...lyrics, ...verse])
    }


    async function onSpeechRecognized(e: SpeechRecognizedEvent) {
        console.log(e, ' recognized!!')
        // if (e.isFinal)
        // setLyrics([...lyrics, ...verse])
    }

    //This continues to add to the string 

    async function onSpeechPartialResults(e: SpeechResultsEvent) {
        // console.log(e.value, ' SpeechPartialResultsEvent')
    }

    // async function onSpeechResults(e: SpeechResultsEvent) {

    //     let words = e.value[0].split(' ')
    //     console.log(words, 'results', lyrics)
    //     setLyrics([...lyrics, ...words])
    //     setVerse(words)

    // let word = e.value[0].split(' ').pop()
    // console.log(e.value[0], word, 'word')
    // // await Voice.stop()
    // await Voice.start("en-US");

    //Filter for only new words.  




    // fetch(`https://api.datamuse.com/words?rel_rhy=${word}`)
    //     .then(res => res.json())
    //     .then(results => {
    //         let newRhymes = [...rhymes, ...results.slice(0, 3)]
    //         console.log('rhymes', newRhymes)
    //         if (results)
    //             setRhymes(newRhymes)
    //     })
    //     .catch(console.error)
    // setResults(e.value ?? []);
    // }





    function onSpeechError(e: SpeechErrorEvent) {
        console.log(e, '000');
    }



    return (
        <View style={{ width: '100%' }} >
            <View>
                <Listen />

            </View>
            {/* <View style={{
                justifyContent: 'space-evenly',
                alignItems: 'center',
                height: '80%',
                width: '100%',
                backgroundColor: 'white',
                padding: 20,
                flexDirection: 'row',
                display: 'flex',
            }}> */}
            <ShowLyrics />
            {/* <View><Text style={{ fontSize: 20 }}>Longer</Text></View>
                <View><Text style={{ fontSize: 20 }}>Keep</Text></View>
                <View><Text style={{ fontSize: 20 }}>Words</Text></View>
                <View><Text style={{ fontSize: 20 }}>Typing</Text></View>
                <View><Text style={{ fontSize: 20 }}>Them</Text></View> */}

            {/* </View> */}
        </View>
    );
}


function Listen() {
    const [isListening, setIsListening] = useState(false);

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

    return (<Button
        title={isListening ? "Stop Recognizing" : "Start Recognizing"}
        onPress={toggleListening}

    />)
}



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
