import classNames from "classnames";
import { Fragment, useEffect, useState } from "react";
import { FaAngleDown, FaCircle } from "react-icons/fa";
import {
  IoIosPause,
  IoIosPlay,
  IoIosSkipBackward,
  IoIosSkipForward,
  IoIosSquare,
} from "react-icons/io";
import player, {
  usePlaybackState,
  usePlaybackTrackChanged,
  useTrackPlayerProgress,
} from "react-web-track-player";
import PlaceholderMusic from "../assets/music_placeholder.png";
import useBreakpoint from "../hooks/useBreakpoint";

export default function Player() {
  const { position, duration } = useTrackPlayerProgress(250);
  const currentTrack = usePlaybackTrackChanged();
  const playbackState = usePlaybackState();

  const [isModal, setIsModal] = useState(false);

  const breakpoint = useBreakpoint();
  const isSmall = breakpoint === "xs" || breakpoint === "sm";

  useEffect(() => {
    player.setupPlayer({
      capabilities: [
        [
          "play",
          async () => {
            await player.play();
          },
        ],
        [
          "pause",
          () => {
            player.pause();
          },
        ],
        [
          "previoustrack",
          async () => {
            await player.skipToPrevious();
          },
        ],
        [
          "nexttrack",
          async () => {
            await player.skipToNext();
          },
        ],
        [
          "stop",
          () => {
            player.reset();
          },
        ],
      ],
    });
    player.setVolume(1);
  }, []);

  async function playOrPause() {
    if (playbackState === "STATE_PAUSED") {
      player.play();
      return;
    }
    if (playbackState === "STATE_PLAYING") {
      player.pause();
      return;
    }
    player.play();
  }

  if (!currentTrack) {
    return <Fragment />;
  }

  if (isModal) {
    return (
      <div className="fixed right-0 bottom-0 top-0 left-0 z-50 flex items-end justify-center bg-black/25 p-4 backdrop-blur xs:pointer-events-none xs:justify-end xs:bg-transparent xs:backdrop-blur-none">
        <div
          className={classNames(
            "pointer-events-auto h-fit max-w-sm grow overflow-hidden rounded-xl bg-white text-black dark:bg-black dark:text-white",
            { "mb-16": isSmall }
          )}
        >
          <div className="flex h-auto flex-col items-center bg-gray-500/50 p-4 sm:py-2">
            <div className="flex w-full justify-between">
              <span
                className="cursor-pointer p-2 sm:p-1"
                onClick={() => {
                  player.reset();
                }}
              >
                <IoIosSquare className="text-2xl" />
              </span>
              <span
                className="cursor-pointer p-2 sm:p-1"
                onClick={() => {
                  setIsModal(false);
                }}
              >
                <FaAngleDown className="text-2xl" />
              </span>
            </div>
            <div className="flex h-full flex-col items-center sm:flex-row sm:space-x-4">
              <div className="flex shrink items-center justify-center">
                <img
                  src={PlaceholderMusic}
                  alt="track-artwork"
                  className="w-full rounded-lg sm:max-h-48"
                />
              </div>
              <div className="flex w-full flex-col items-center p-2 pb-3 sm:p-0 sm:pb-0">
                <div className="flex w-full shrink grow flex-col py-2">
                  <span className="pb-2 text-xl leading-none">
                    {currentTrack?.title}
                  </span>
                  <span className="leading-none opacity-75">
                    {currentTrack?.artist}
                  </span>
                </div>
                <div className="my-8 h-1 w-full bg-gray-500/50 sm:my-4">
                  <div
                    className="flex h-1 justify-end bg-white"
                    style={{
                      width: `${
                        duration && position ? (position / duration) * 100 : 0
                      }%`,
                    }}
                  >
                    <FaCircle className="-mt-[0.35rem] -mr-[0.35rem]" />
                  </div>
                </div>
                <div className="flex w-full items-center justify-center">
                  <div
                    onClick={() => {
                      player.skipToPrevious();
                    }}
                    className="cursor-pointer p-2"
                  >
                    <IoIosSkipBackward className="text-4xl sm:text-2xl" />
                  </div>
                  <div onClick={playOrPause} className="cursor-pointer p-2">
                    {playbackState === "STATE_PLAYING" ? (
                      <IoIosPause className="text-8xl sm:text-4xl" />
                    ) : (
                      <IoIosPlay className="text-8xl sm:text-4xl" />
                    )}
                  </div>
                  <div
                    onClick={() => {
                      player.skipToNext();
                    }}
                    className="cursor-pointer p-2"
                  >
                    <IoIosSkipForward className="text-4xl sm:text-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 z-40 flex justify-center xs:justify-end">
      <div
        className={classNames(
          "max-w-sm grow cursor-pointer overflow-hidden rounded-xl bg-white text-black dark:bg-black dark:text-white",
          { "mb-16": isSmall }
        )}
        onClick={() => {
          setIsModal(true);
        }}
      >
        <div className="relative flex h-[4.25rem] flex-col items-center bg-gray-500/50">
          <div className="flex h-[4.25rem] w-full items-center p-2 pb-3">
            <img
              src={PlaceholderMusic}
              alt="track-artwork"
              className="h-full rounded-lg"
            />
            <div className="flex min-w-0 shrink grow flex-col px-2">
              <span className="truncate pb-1 text-lg leading-none">
                {currentTrack?.title}
              </span>
              <span className="truncate text-sm leading-none opacity-75">
                {currentTrack?.artist}
              </span>
            </div>
            <div
              onClick={async (e) => {
                e.stopPropagation();
                await playOrPause();
              }}
              className="cursor-pointer p-2"
            >
              {playbackState === "STATE_PLAYING" ? (
                <IoIosPause className="text-2xl" />
              ) : (
                <IoIosPlay className="text-2xl" />
              )}
            </div>
          </div>
          <div className="absolute bottom-0 h-1 w-full bg-gray-500/50">
            <div
              className="h-1 bg-white"
              style={{
                width: `${
                  duration && position ? (position / duration) * 100 : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
