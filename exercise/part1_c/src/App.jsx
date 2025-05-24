import { useState } from 'react';

const App = () => {
  const [counter, setCounter] = useState(0);
  console.log('rendering with counter value', counter);

  const increaseByOne = () => {
    console.log('increasing, value before', counter);
    setCounter(counter + 1);
  };

  const decreaseByOne = () => {
    console.log('decreasing, value before', counter);
    setCounter(counter - 1);
  };

  const setToZero = () => {
    console.log('resetting to zero, value before', counter);
    setCounter(0);
  };
  // setTimeout(() => setCounter(counter + 1), 1000);

  // console.log('rendering...', counter);

  const Display = ({ counter }) => {
    return <div>{counter}</div>;
  };

  const Button = ({ onClick, text }) => {
    return <button onClick={onClick}>{text}</button>;
  };

  return (
    <div>
      <Display counter={counter} />
      <Button text={'plus'} onClick={increaseByOne} />
      <Button text={'reset'} onClick={setToZero} />
      <Button text={'minus'} onClick={decreaseByOne} />
    </div>
  );
};
export default App;
