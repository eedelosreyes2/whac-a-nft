// Game thanks to - https://www.smashingmagazine.com/2021/05/get-started-whac-a-mole-react-game/
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

const TIME_LIMIT = 30000;
const MOLE_SCORE = 100;
const NUMBER_OF_MOLES = 9;
const POINTS_MULTIPLIER = 0.9;
const TIME_MULTIPLIER = 1.25;

const generateMoles = (amount) =>
  new Array(amount).fill(0).map(() => ({
    speed: gsap.utils.random(0.5, 1),
    delay: gsap.utils.random(0.5, 4),
    points: MOLE_SCORE,
  }));

const Mole = ({ onWhack, points, delay, speed, pointsMin = 10 }) => {
  const [whacked, setWhacked] = useState(false);
  const bobRef = useRef(null);
  const pointsRef = useRef(points);
  const buttonRef = useRef(null);

  useEffect(() => {
    gsap.set(buttonRef.current, {
      yPercent: 100,
      display: 'block',
    });

    bobRef.current = gsap.to(buttonRef.current, {
      yPercent: 0,
      duration: speed,
      yoyo: true,
      repeat: -1,
      delay: delay,
      repeatDelay: delay,
      onRepeat: () => {
        pointsRef.current = Math.floor(
          Math.max(pointsRef.current * POINTS_MULTIPLIER, pointsMin)
        );
      },
    });

    return () => {
      if (bobRef.current) bobRef.current.kill();
    };
  }, [pointsMin, delay, speed]);

  useEffect(() => {
    if (whacked) {
      pointsRef.current = points;
      bobRef.current.pause();
      gsap.to(buttonRef.current, {
        yPercent: 100,
        duration: 0.1,
        onComplete: () => {
          gsap.delayedCall(gsap.utils.random(1, 3), () => {
            setWhacked(false);
            bobRef.current
              .restart()
              .timeScale(bobRef.current.timeScale() * TIME_MULTIPLIER);
          });
        },
      });
    }
  }, [whacked]);

  const whack = () => {
    setWhacked(true);
    onWhack(pointsRef.current);
  };

  return (
    <div
      className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48
      pt-5 flex flex-col overflow-hidden"
    >
      <button ref={buttonRef} onClick={whack}>
        <Image src="/mole.png" width={175} height={175} alt="mole" />
      </button>
    </div>
  );
};

const Score = ({ value }) => (
  <div className="text-xl sm:text-5xl">{`Score: ${value}`}</div>
);

const Timer = ({ time, interval = 1000, onEnd }) => {
  const [internalTime, setInternalTime] = useState(time);
  const timerRef = useRef(time);
  const timeRef = useRef(time);

  useEffect(() => {
    if (internalTime === 0 && onEnd) {
      onEnd();
    }
  }, [internalTime, onEnd]);

  useEffect(() => {
    timerRef.current = setInterval(
      () => setInternalTime((timeRef.current -= interval)),
      interval
    );
    return () => {
      clearInterval(timerRef.current);
    };
  }, [interval]);

  return (
    <div className="text-xl sm:text-5xl sm:mt-8">{`Time: ${
      internalTime / 1000
    }s`}</div>
  );
};

const Footer = () => (
  <a
    href="https://elijahdr.vercel.app/"
    target="_blank"
    rel="noreferrer"
    className="absolute text-lg bottom-7"
  >
    Created by Elijah
  </a>
);

const Game = () => {
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [moles, setMoles] = useState(generateMoles(NUMBER_OF_MOLES));

  const onWhack = (points) => setScore(score + points);

  const endGame = () => {
    setPlaying(false);
    setFinished(true);
  };

  const startGame = () => {
    setScore(0);
    setPlaying(true);
    setFinished(false);
  };

  const leaveGame = () => {
    setPlaying(false);
    setFinished(false);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center 
        text-center font-bold pt-32 pb-32 lg:pb-64 relative"
      style={{
        backgroundImage: "url('/game-bg.png')",
        backgroundSize: '100% 100%',
      }}
    >
      {!playing && !finished && (
        <div className="">
          <div className="text-4xl sm:text-5xl md:text-7xl">Whac-a-NFT</div>
          <div className="max-w-xl text-xl px-7 md:px-0 my-10">
            Integrate your NFTs into a play-to-earn Whac-a-Mole-like blockchain
            game and view the on-chain scores of other players!
          </div>
          <div className="flex flex-col items-center">
            <button className="button mt-5" onClick={startGame}>
              Connect Wallet
            </button>
            <div className="text-lg py-7">Or play without logging in</div>
            <button className="button" onClick={startGame}>
              Play
            </button>
          </div>
        </div>
      )}

      {playing && (
        <>
          <div className="flex w-full justify-between px-5 lg:px-32 absolute top-5">
            <div className="text-left">
              <Score value={score} />
              <Timer time={TIME_LIMIT} onEnd={endGame} />
            </div>
            <button className="button" onClick={endGame}>
              End Game
            </button>
          </div>

          <div className="absolute left-0 right-0 m-auto max-w-4xl bottom-20 sm:pb-[3vh]">
            <div className="flex flex-wrap lg:max-w-2xl justify-center mx-auto">
              {moles.map(({ delay, speed, points }, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Mole
                    key={index}
                    onWhack={onWhack}
                    points={points}
                    delay={delay}
                    speed={speed}
                  />
                  <div className="h-1">
                    <Image src="/hole.png" width={175} height={20} alt="mole" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {finished && (
        <div className="sm:pt-64">
          <div className="flex flex-col items-center gap-10">
            <Score value={score} />
            <button className="button" onClick={startGame}>
              Play Again
            </button>
            <button className="button" onClick={leaveGame}>
              Disconnect
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Game;
