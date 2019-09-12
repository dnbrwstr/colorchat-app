import { makeArray, rand } from "./Utils";
import { createSeedMessage, convertFromRelativeSize } from "./MessageUtils";

const randomColor = () => `rgb(${rand(255)},${rand(255)},${rand(255)})`;

const names = [
  "pearl bush",
  "ragamuffin",
  "half milk white",
  "quarter concrete",
  "green white",
  "honeysuckle",
  "chrome white",
  "gin",
  "aqua spring",
  "key lime",
  "aqua squeeze",
  "pale spring bud"
].map(name => {
  return name
    .split(" ")
    .map(p => p[0].toUpperCase() + p.slice(1))
    .join(" ");
});

const randomFirstName = () => {
  return "xxx";
};

const randomLastName = () => {
  return "xxx";
};

const createScreenshotState = () => {
  const user = {
    id: 0,
    name: "Dan Brewster",
    phoneNumber: "+14013911814",
    avatar: "#0000FF",
    token: "XXX",
    deviceToken: "XXX",
    deviceTokenSaved: true
  };

  const contacts = makeArray(12).map(n => ({
    id: n + 1,
    mathed: true,
    avatar: randomColor(),
    givenName: names[n],
    familyName: ""
  }));

  console.log(contacts);

  const messages = {
    total: null,
    static: makeArray(12 * 15).map(n => {
      const contactId = (n % 12) + 1;
      const [senderId, recipientId] =
        Math.random() > 0.5 ? [0, contactId] : [contactId, 0];
      return {
        ...convertFromRelativeSize(createSeedMessage()),
        senderId,
        recipientId
      };
    }),
    working: [],
    enqueued: [],
    sending: [],
    placeholder: []
  };

  const conversations = makeArray(6).map(n => ({
    recipientId: contacts[n].id,
    recipientName: contacts[n].firstName,
    lastMessage: messages.static[rand(messages.static.length)],
    unread: false,
    partnerIsComposing: false
  }));

  return {
    user,
    contacts,
    messages,
    conversations
  };
};

export default createScreenshotState;
