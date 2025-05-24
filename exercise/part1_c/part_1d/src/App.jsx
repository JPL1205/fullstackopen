import { useState } from 'react';

const History = ({ allClicks }) => {
  if (allClicks.length === 0) {
    return <div>the app is used by pressing the buttons</div>;
  }
  return <div>button press history: {allClicks.join(' ')}</div>;
};

const Display = (props) => <div>{props.value}</div>;

const Button = ({ onClicks, text }) => {
  return <button onClick={onClicks}>{text}</button>;
};

function App() {
  // const [clicks, setClicks] = useState({
  //   left: 0,
  //   right: 0,
  // });

  // const handleLeftClicks = () => {
  //   const newClicks = {
  //     ...clicks,
  //     left: clicks.left + 1,
  //   };
  //   setClicks(newClicks);
  // };

  // const handleRightClicks = () => {
  //   const newClicks = {
  //     ...clicks,
  //     right: clicks.right + 1,
  //   };
  //   setClicks(newClicks);
  // };
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [allClicks, setAll] = useState([]);
  const [total, setTotal] = useState(0);
  const [value, setValue] = useState(10);

  const handleLeft = () => {
    setAll(allClicks.concat('L'));
    console.log('left before', left);
    const updatedLeft = left + 1;
    setLeft(updatedLeft);
    console.log('left after', left);
    setTotal(updatedLeft + right);
  };

  const handleRight = () => {
    setAll(allClicks.concat('R'));
    const updatedright = right + 1;
    setRight(updatedright + 1);
    // setTotal(total + 1);
    setTotal(left + updatedright);
  };

  const setToValue = (newValue) => {
    console.log('value now', newValue);
    setValue(newValue);
  };

  // debugger;

  return (
    <div>
      {left}
      <Button onClicks={handleLeft} text={'left'} />
      <Button onClicks={handleRight} text={'right'} />
      {right}
      <History allClicks={allClicks} />
      <p>{total}</p>
      <Display value={value} />
      <Button onClicks={() => setToValue(1000)} text={'thousand'} />
      <Button onClicks={() => setToValue(0)} text={'reset'} />
      <Button onClicks={() => setToValue(value + 1)} text={'minus one'} />
    </div>
  );
}

export default App;
