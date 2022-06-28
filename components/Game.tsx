import { Fragment, useEffect, useRef, useState } from 'react';

const Moles = ({ children }) => <div>{children}</div>;
const Mole = () => <button>Mole</button>;
const Score = () => <div>Score: 0</div>;

const TIME_LIMIT = 30000;

const Timer = ({ time, interval = 1000, onEnd }) => {
  const [internalTime, setInternalTime] = useState(time);
  const timerRef = useRef(time);
  const timeRef = useRef(time);
  useEffect(() => {
    timerRef.current = setInterval(
      () => setInternalTime((timeRef.current -= interval)),
      interval
    );
    return () => {
      clearInterval(timerRef.current);
    };
  }, [interval]);
  return <div>{`Time: ${internalTime / 1000}s`}</div>;
};

const Game = () => {
  const [playing, setPlaying] = useState(false);
  return (
    <Fragment>
      {!playing && <h1>Whac a Mole</h1>}
      <button onClick={() => setPlaying(!playing)}>
        {playing ? 'Stop' : 'Start'}
      </button>
      {playing && (
        <Fragment>
          <Score />
          <Timer time={TIME_LIMIT} onEnd={() => setPlaying(false)} />
          <Moles>
            <Mole />
            <Mole />
            <Mole />
            <Mole />
            <Mole />
          </Moles>
        </Fragment>
      )}
    </Fragment>
  );
};

// render(<Game/>, document.getElementById('app'))

export default Game;
