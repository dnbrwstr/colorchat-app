import AddressBook from 'react-native-addressbook';
import Promise from 'bluebird'
import SeedNumbers from './data/SeedNumbers'

let randomNameishString = () => {
  var length = Math.floor(Math.random() * 12 + 3);
  var characters = "abcdefghijklmnopqrstuvwxyz";
  var string = "";
  for (var i = 0; i < length; ++i) {
    string += characters[Math.floor(Math.random() * characters.length)];
  }
  string[0] = string[0].toUpperCase();
  return string;
}

export let seedAddressBook = async () => {
  let contacts = await AddressBook.getContactsAsync();

  // Bail out if we've already seeded
  if (contacts.length > 20) return;

  try {
    await SeedNumbers.map((n) => {
      return AddressBook.addContactAsync({
        firstName: randomNameishString(),
        lastName: randomNameishString(),
        phoneNumbers: [{
          label: 'mobile',
          number: n
        }]
      });
    });
  } catch (e) {
    console.log(e);
  }

}