import { useState } from 'react';

const Header = ({ anecdotes, vote, selected }) => {
  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <br />
      <p>has {vote[selected]} votes</p>
      <br />
    </div>
  );
};

const Footer = ({ vote, anecdotes }) => {
  const getMaxValIdx = (arr) => {
    // if (arr.length
    if (arr.length === 0) return -1;
    let maxVal = -Infinity;
    let maxIdx = -1;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > maxVal) {
        maxVal = arr[i];
        maxIdx = i;
      }
    }
    return maxIdx;
  };

  const sum = vote.reduce((acc, val) => acc + val, 0);
  const mostVoteAnecdote = sum === 0 ? '' : anecdotes[getMaxValIdx(vote)];

  return (
    <div>
      <h1>Anecdote with most votes</h1>
      <p>{mostVoteAnecdote}</p>
    </div>
  );
};
function App() {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.',
  ];

  const generateRandomNum = () => {
    return Math.floor(Math.random() * anecdotes.length);
  };

  const incrementVote = (idx) => {
    console.log('vote before', vote);
    const newVote = [...vote];
    newVote[idx] += 1;
    console.log('vote after', newVote);
    setVote(newVote);
  };

  const [selected, setSelected] = useState(0);
  const [vote, setVote] = useState(
    Array.from({ length: anecdotes.length }, () => 0)
    // Array.from({ length: n }) creates an array with n undefined slots
    // The second argument is a mapping function to fill each slot with 0
  );

  return (
    <div>
      <Header anecdotes={anecdotes} vote={vote} selected={selected} />
      <button onClick={() => incrementVote(selected)}>vote</button>
      <button onClick={() => setSelected(generateRandomNum())}>
        next anecdote
      </button>
      <Footer anecdotes={anecdotes} vote={vote} />
    </div>
  );
}

export default App;
