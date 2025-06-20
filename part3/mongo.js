const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> [name] [number]');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstackopen:${password}@cluster0.6hrazix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', phonebookSchema);

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    id: genID(),
    name: name,
    number: number,
  });

  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  console.log('phonebook:');
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });

    mongoose.connection.close();
  });
} else {
  console.log('Usage: node mongo.js <password> [name] [number]');
  mongoose.connection.close();
}
