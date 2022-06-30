// Game thanks to - https://www.smashingmagazine.com/2021/05/get-started-whac-a-mole-react-game/
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const TIME_LIMIT = 30000;
const MOLE_SCORE = 100;
const NUMBER_OF_MOLES = 5;
const POINTS_MULTIPLIER = 0.9;
const TIME_MULTIPLIER = 1.25;

const generateMoles = (amount) =>
  new Array(amount).fill(0).map(() => ({
    speed: gsap.utils.random(0.5, 1),
    delay: gsap.utils.random(0.5, 4),
    points: MOLE_SCORE,
  }));

const InnerContainer = ({ children }) => (
  <div className="pt-64">{children}</div>
);

const Moles = ({ children }) => <div className="flex">{children}</div>;

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
    <div className="mole-hole">
      <button className="mole" ref={buttonRef} onClick={whack}>
        Mole
      </button>
    </div>
  );
};

const Score = ({ value }) => (
  <div className="text-2xl">{`Score: ${value}`}</div>
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

  return <div className="text-2xl">{`Time: ${internalTime / 1000}s`}</div>;
};

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

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center text-center font-bold pt-32"
      style={{
        backgroundImage: "url('/game-bg.png')",
        backgroundSize: '100% 100%',
      }}
    >
      {!playing && !finished && (
        <div className="">
          <div className="text-7xl">Whac-a-NFT</div>
          <div className="max-w-2xl text-xl my-10">
            Integrate your NFTs into a play-to-earn Whac-a-Mole-like blockchain
            game and view the on-chain scores of other players!
          </div>
          <button className="button mt-5" onClick={startGame}>
            Start Game
          </button>
        </div>
      )}

      {playing && (
        <InnerContainer>
          <button className="button absolute top-5 right-5" onClick={endGame}>
            End Game
          </button>
          <div className="absolute text-left top-5 left-5">
            <Score value={score} />
            <Timer time={TIME_LIMIT} onEnd={endGame} />
          </div>
          <Moles>
            {moles.map(({ delay, speed, points }, index) => (
              <Mole
                key={index}
                onWhack={onWhack}
                points={points}
                delay={delay}
                speed={speed}
              />
            ))}
          </Moles>
        </InnerContainer>
      )}

      {finished && (
        <InnerContainer>
          <Score value={score} />
          <button className="button mt-5" onClick={startGame}>
            Play Again
          </button>
        </InnerContainer>
      )}
    </div>
  );
};

export default Game;
