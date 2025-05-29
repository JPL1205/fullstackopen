const Header = ({ name }) => <h2>{name}</h2>;

const Content = ({ parts }) => {
  console.log(parts);
  return (
    <div>
      {parts.map((p, i) => (
        <Part key={i} name={p.name} exercise={p.exercises} />
      ))}
    </div>
  );
};

const Part = ({ name, exercise }) => (
  <p>
    {name} {exercise}
  </p>
);

const Total = ({ parts }) => {
  return (
    <b>
      total of {parts.reduce((acc, curr) => acc + curr.exercises, 0)} exercises
    </b>
  );
};

const Course = ({ course }) => {
  console.log(course);
  return (
    <div>
      {course.map((c, i) => (
        <div key={i}>
          <Header name={c.name} />
          <Content parts={c.parts} />
          <Total parts={c.parts} />
        </div>
      ))}
    </div>
  );
};

export default Course;
