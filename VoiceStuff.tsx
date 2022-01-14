import React, { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { unsplash_access_key, pixabayKey } from './.env.js'
// import SoundPlayer from 'react-native-sound-player'
// import TrackPlayer from 'react-native-track-player';
import Sound from 'react-native-sound'

import Voice, {
    SpeechResultsEvent,
    SpeechErrorEvent,
    SpeechRecognizedEvent,
    SpeechEndEvent,
    SpeechVolumeChanged

} from "@react-native-voice/voice";

export default function App() {
    console.log('does this get reset somehow?')
    // const [results, setResults] = useState([] as string[]);

    const audioTrackURL = `song.mp3` //`https://audio.jukehost.co.uk/LhnMKCU6oWC8aAXQwNJmofwJvQmAmMfh` //'https://previews.customer.envatousercontent.com/files/207000702/preview.mp3' //'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3' //`https://previews.customer.envatousercontent.com/files/207000702/preview.mp3` //'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3';

    const [isPlaying, setIsPlaying] = useState(false)
    const [song, setSong] = useState({})
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

    const playTrack = () => {
        console.log('play', isPlaying)
        toggleListening()
        Sound.setCategory('Playback');
        if (!isPlaying) {


            // Load the sound file 'whoosh.mp3' from the app bundle
            // See notes below about preloading sounds within initialization code below.
            var whoosh = new Sound(audioTrackURL, Sound.MAIN_BUNDLE, (error) => {
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
                <Button title={isPlaying ? 'Stop' : 'Play Track'} onPress={playTrack} />

                <Button title={isListening ? 'Stop' : 'Listen'} onPress={toggleListening} />


            </View>

            <ShowLyrics />
        </View>
    );
}


function findRhyme({ word }) {
    return fetch(`https://api.datamuse.com/words?rel_rhy=${word}`)
        .then(res => res.json())
        .then(results => {
            return results.slice(0, 10)
        })
        .catch(console.error)
}

let i = 0

function ShowLyrics() {
    const [lyrics, setLyrics] = useState([]);
    const [verse, setVerse] = useState([] as string[])
    const [rhymers, setRhymers] = useState(['', '', ''])
    const [pause, setPause] = useState(null)
    const prevLyricsRef = useRef(null);

    // console.log('show', verse.length)

    useEffect(() => {
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechPartialResults = onSpeechPartialResults;
        Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, [])



    function isThisAPreviousRhyme({ word, lyrics }) {
        let match = false;
        for (let lyric of lyrics) {
            for (let rhyme of lyric.rhymes) {
                if (rhyme.word.toLowerCase() == word.toLowerCase()) {
                    rhyme.match = true
                    //return true
                    match = true
                }
            }
        }
        return match
    }

    async function onSpeechResults(e: SpeechResultsEvent) {
        console.log('on result')


        //[Knock, Knock]
        let words = e.value[0].split(' ')

        setVerse((verse) => {
            let newWords = words.filter(word => verse.indexOf(word) === -1)
            for (let word of newWords) {
                findRhyme({ word }).then(async rhymes => {
                    i++
                    // console.log(i, ' total requests')
                    let imageUrl = ''
                    let synonyms = []
                    try {
                        //let res = await fetch(`https://api.unsplash.com/photos/random?client_id=${unsplash_access_key}&query=${word}`)
                        let res = await fetch(`https://pixabay.com/api?key=${pixabayKey}&q=${word}`)
                        let json = await res.json()
                        imageUrl = json?.hits ? json.hits[0].previewURL : ''

                        let syn = await fetch(`https://api.datamuse.com/words?rel_syn=${word}`)
                        synonyms = await syn.json()
                        synonyms = synonyms.slice(0, 3)
                        console.log(synonyms, ' 2222 ')
                        //image = json.hits[Math.floor(Math.random() * json.hits.length)].previewURL
                    } catch (err) {
                        console.log(err, ' but dont crash')
                    }


                    console.log('image is ', imageUrl)


                    setLyrics((lyrics) => {


                        let obj = {
                            word,
                            rhymes,
                            prevMatch: isThisAPreviousRhyme({ word, lyrics: [...lyrics, { word, rhymes }] }),
                            imageUrl,
                            synonyms
                        }

                        return [...lyrics, obj]
                    })

                })
            }
            return words
        })
    }


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
                    flexDirection: 'row',
                    padding: 10

                }}>
                    {lyrics.map((word, i) => {
                        return (


                            <Text style={{ display: 'flex', flexDirection: 'row' }} key={`${word}-${i}`}>
                                {word.word + ' '}
                            </Text>

                        )
                    })}
                </View>
            </ScrollView>
            <View style={{
                backgroundColor: '#eee',
                width: '100%',
                height: 500,
                display: 'flex',
                position: 'absolute',
                paddingBottom: 250,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ScrollView
                    style={{
                        display: 'flex',
                        height: 200,
                        zIndex: -1,
                        margin: 'auto',
                        width: '100%',
                        transform: [{ rotate: '180deg' }],
                        direction: 'rtl',
                        overflow: 'scroll'
                    }}

                >
                    <View style={{
                        overflow: 'hidden',
                        transform: [{ rotate: '180deg' }]
                    }}>
                        {lyrics.map((word, i) => {
                            return (

                                <View key={`${word}-${i}`} style={{ margin: 5, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>


                                    <Text style={{ flexWrap: 'nowrap', flexDirection: 'row', display: 'flex', fontSize: 16, overflow: 'hidden' }} key={`word-${i}`}>
                                        {word.word + ' '}
                                    </Text>
                                    <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', overflow: 'hidden', width: '100%' }}>
                                        {word.rhymes.map((rhyme, i) =>

                                            <Text
                                                key={`${rhyme}-${i}`}

                                                style={{ fontSize: 11, color: rhyme.match ? 'red' : '#888' }}> {rhyme.word} </Text>

                                        )}
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView >
                <Timer lyrics={lyrics} verse={verse} rhymers={rhymers} setRhymers={setRhymers} />
            </View>



            {/* <View style={{ display: 'flex', flexDirection: 'row' }}>
                {verse.map(word => <Text>{word + ' '}</Text>)}
            </View> */}
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
});




function Timer({ lyrics, verse, rhymers, setRhymers }) {
    useEffect(() => {

        const timer = () => setTimeout(() => {
            // let lastWord = verse.pop()
            let lastWord = lyrics[lyrics.length - 1]

            console.log('lastWord', lastWord?.word)
            if (!lastWord?.word) return
            let newRhymers = [...rhymers]
            newRhymers.shift()

            let last = lyrics.find(l => l.word === lastWord)
            console.log(last?.word, 'last')
            if (last) {
                newRhymers.push(last)
                setRhymers(newRhymers)
            } else {
                newRhymers.push(lastWord)
                setRhymers(newRhymers)
            }
        }, 500);
        const timerId = timer();
        return () => {
            clearTimeout(timerId);
        };
    }, [lyrics])

    console.log('rhymers', rhymers.map(r => r.word))

    return (
        <View style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: 'white',
            bottom: -200,
            zIndex: 1212,
            width: '100%'
        }}>
            {rhymers.map((lyric, i) => {

                const rhymes = lyric.rhymes ? lyric.rhymes.map((eachRhyme, i) => {
                    return (
                        <Text
                            key={i}
                            style={{ fontSize: 10 }}
                        >{eachRhyme.word}
                        </Text>
                    )
                }) : []

                const synonyms = lyric.synonyms ? lyric.synonyms.map((eachSynonym, i) => {
                    return (
                        <Text
                            key={i}
                            style={{ fontSize: 10 }}
                        >{eachSynonym.word}
                        </Text>
                    )
                }) : []


                return (
                    <>

                        <View
                            style={{ display: 'flex', flexDirection: 'column' }}
                            key={i}
                        >
                            <Text
                                key={i}
                                style={{
                                    fontSize: 20
                                }}

                            >{lyric?.word}</Text>

                            {lyric.imageUrl ?

                                <Image
                                    style={{ width: 100, height: 100 }}
                                    source={{ uri: lyric?.imageUrl }}
                                />
                                : null
                            }
                            <View>
                                <Text>rhymes:</Text>
                                {rhymes}
                            </View>
                            <View>
                                <Text>synonyms:</Text>
                                {synonyms}
                            </View>
                        </View>

                    </>

                )
            }
            )}
        </View>
    )
}











// let lastStr = "dog cat my"
// let currentStr = "dog cat my dog poodle"

// let theLyrics = [
//     {
//         word: 'dog',
//         rhymes: ['fog', 'smog']
//     }, {
//         word: 'cat',
//         rhymes: ['hat', 'bat']
//     },
//     {
//         word: 'my',
//         rhymes: ['sly', 'fly']
//     },
//     {
//         word: 'dog',
//         rhymes: ['fog', 'smog']
//     }

// ]



// async function onSpeechResults(e: SpeechResultsEvent) {
//     //[Knock, Knock]
//     let words = e.value[0]

//     console.log(words)

//     setVerse((verse) => {
//         console.log(words, '-=-=-=', verse)
//         let newWords = words.replace(prevLyricsRef.current, '').trim()//.split(' ')
//         prevLyricsRef.current = newWords
//         console.log(newWords, ' newWordsr')
//         for (let word of newWords.split(' ')) {
//             if (!word) return
//             findRhyme({ word }).then(rhymes => {
//                 i++
//                 console.log(i, ' total requests')
//                 setLyrics((lyrics) => {
//                     return [...lyrics, { word, rhymes }]
//                 })

//             })
//         }
//         return words
//     })
// }




async function onSpeechEnd(e: SpeechEndEvent) {
    console.log('sppech end')
}
async function onSpeechRecognized(e: SpeechRecognizedEvent) {
    console.log('speech recognized!!')

}
async function onSpeechPartialResults(e: SpeechResultsEvent) {
    console.log(e.value, ' SpeechPartialResultsEvent')
}
async function onSpeechVolumeChanged(e: SpeechVolumeChanged) {
    // console.log(e.value, ' SpeechVolumeChanged')
}
async function onSpeechError(e: SpeechErrorEvent) {
    console.log(e, '000');
}