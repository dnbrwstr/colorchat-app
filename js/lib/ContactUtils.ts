import Bluebird from 'bluebird';
import Contacts from 'react-native-contacts';
import SeedNumbers from './data/SeedNumbers';

export const checkPermission = Bluebird.promisify(Contacts.checkPermission);
export const requestPermission = Bluebird.promisify(Contacts.requestPermission);
export const getAll = Bluebird.promisify(Contacts.getAll);
export const addContact = (contact: Partial<Contacts.Contact>) =>
  // @ts-ignore force add contact to accept a partial contact
  // rather than having to specify evey single prop to add
  Bluebird.promisify(Contacts.addContact)(contact);

const randomNameishString = () => {
  var length = Math.floor(Math.random() * 12 + 3);
  var characters = 'abcdefghijklmnopqrstuvwxyz';
  var string = '';
  for (var i = 0; i < length; ++i) {
    string += characters[Math.floor(Math.random() * characters.length)];
  }
  string[0].toUpperCase() + string.slice(1);
  return string;
};

const createSeedContact = (number: string) => {
  return {
    givenName: randomNameishString(),
    familyName: randomNameishString(),
    phoneNumbers: [
      {
        label: 'mobile',
        number: number,
      },
    ],
  };
};

export const seedAddressBook = async () => {
  const contacts = await getAll();

  // Bail out if we've already seeded
  if (contacts.length > 20) return;

  try {
    SeedNumbers.slice(0, 3).map(n => {
      return addContact(createSeedContact(n));
    });
  } catch (e) {
    console.log(e);
  }
};
