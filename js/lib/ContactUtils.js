import Contacts from "react-native-contacts";
import SeedNumbers from "./data/SeedNumbers";

let randomNameishString = () => {
  var length = Math.floor(Math.random() * 12 + 3);
  var characters = "abcdefghijklmnopqrstuvwxyz";
  var string = "";
  for (var i = 0; i < length; ++i) {
    string += characters[Math.floor(Math.random() * characters.length)];
  }
  string[0] = string[0].toUpperCase();
  return string;
};

export let seedAddressBook = async () => {
  let contacts = await Contacts.getAllAsync();

  // Bail out if we've already seeded
  if (contacts.length > 20) return;

  try {
    await SeedNumbers.slice(0, 3).map(n => {
      return Contacts.addContactAsync({
        givenName: randomNameishString(),
        familyName: randomNameishString(),
        phoneNumbers: [
          {
            label: "mobile",
            number: n
          }
        ]
      });
    });
  } catch (e) {
    console.log(e);
  }
};
