# reVos Web Extension

## What is reVos

reVos is a smart video player built to save you time.  It was created as a follow-up to [kSS](https://github.com/dupontinquiries/kss), a program that processed & reencoded local video files.  reVos currently exists as a web extension that speeds up html video players based on audio levels.

### Behind the Name

The name is a play on the words revision, re-vision, & videos.  The capital v is eye-catching, which alludes to the fact that reVos is designed to keep users focused on the content of the video and not the semantics of speech.

## Features

### Built-In Audio Compressor

Quickly & easily turn up quiet audio by using the real-time compressor controls.

### Realtime Silence Removal

reVos can monitor the audio level of a video in real-time to intelligently skip over pauses in speech by varying the playback speed.  This means that speech will play back at a normal rate, while pauses will be shortened.

## Bugs & Quirks

### Limited Control

reVos has some built-in limiters to its ability to retime videos in real-time.  This is because I found that my MacBook was unable to handle the aggressive retiming that the software is capable of.  I am currently working on a toggle that will allow a user to bypass these restrictions if they wish, but rest assured knowing the program works well even with the limitations imposed.
