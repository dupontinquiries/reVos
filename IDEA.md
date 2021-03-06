# reVos

## Behind the Name

The name is a play on the words revision ("rev"), re-vision ("reV"), & videos ("os").  The capital v is eye-catching, which alludes to the fact that reVos is designed to keep users focused on the content of the video and not the semantics.

## Potential Features

### Video Player

Aims to support webm due to it's shared vision of FOSS, and it will hopefully support mp4 as well because the format is very popular and will save time and energy that would have been spent on reencoding.

This video player will aim to be extremely visually appealing and fluid/smooth in operation so that the user will enjoy looking at the screen.

The video player will also support the playback of videos at any speed between 1.0 and 3.0 (maybe just up to 2.0).

The video player should also support voice commands that may be limited to only basic activities such as play & pause.

### reV Mode

reV Mode will engage a unique set of features.  Various modes and settings will be used to speed up playback time of videos.

#### SS Protocol

The SS protocal will speed up quieter & silent parts of a video based on a user-malleable speed curve.  For example, a user can set up a logarithmic curve to greatly speed up a video when a professor is not speaking.  A subtle increase of the playback speed speed from 1.0 to 1.07 over a lifetime can save a lot of time.

The SS Protocol will use lazy loading of audio data to load only one minute of audio data at a time.  This will help reduce memory usage and will also help increase video load times.

#### Lecture Protocol

Lecture protocol is a voice-centric cleaving algorithm that skips silent parts in a video.  It is similar to this programs predecessor, kSS.

Lecture protocol may also have a tentative feature: uh-ware.  Uh-ware is a rich feature that can remove filler words and sounds (ie. a pen tapping or a short breath).  Uh-ware may be implemented in one or all of two proposed methods:

1. The user can select a sound from the timeline and add it to a set of sounds to skip.
2. An AI will understand language in a way that enables it to identify these sounds autonomously.
3. A pre-established database of presets will be used to determine whether or not audio is essential.

#### Heartbeat

The heartbeat protocol will attempt to speed up slower parts of a video to be as fast as the quicker parts of a video.  This process will be difficult to implement, as video tempo does not always correlate with shallow features such as audio levels.

### DAPP Commenting

Some sort of comment system that populates via a secure & private decentralized ledger could be used to allow users to talk about a particular video privately.  This level of communication could augment the amount of information & value that watching a video provides to a user.

### Synchronize Mode (tentative)

This features addition is tentative.  The idea is that the player will be able to either synchronize a playhead or a video stream via decentralized communication protocols such as bluetooth and nfc.  This mode should also work over the internet without any custom code running on a centralized server.

## Language Choice

This software is expected to be written in multiple languages to create a hierarchy that combines lower level performance with higher-level interface & design elements.

### C++

C++ would offer fast operations, which are critical for a real-time system.

### JavaScript

JavaScript would allow this application to run in a web browser on any device using the html5 web player.  Another API such as react could be used, but it is important that the app remain independent of any backend server.  After learning about modern JavaScript, I think it would be a good choice.

Another approach that uses JavaScript is a chromium web extension.  This approach would be useful for speeding up videos on sites like YouTube. 

### Python

Python is a popular language that makes writing apps easy.

Python may be more more enticing than C++ if the code is written very efficiently.

### Go



### Rust

### Haskell
