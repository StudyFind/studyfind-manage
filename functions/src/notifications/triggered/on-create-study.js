const { firestore } = require("admin");
const { getDocument } = require("utils");
const { CREATE_STUDY } = require("../__utils__/notification-codes");
const { RestClient } = require('@signalwire/node')

const sendEmailNotification = async () => {
  return firestore.collection("mail").add({
    to: "yohan@studyfind.org",
    message: {
      subject: "New Study Created",
      text: "A new study has been created in your account",
    },
  });
};

const projectId = '27ada9cd-27a2-4f87-83c6-87de33c37404';
const projectToken = 'PTa5c0e106704976843e94000e800faa36cdd3452beb464b0e';
const spaceUrl = 'studyfind-test.signalwire.com';
const client = new RestClient(projectId, projectToken, { signalwireSpaceUrl: spaceUrl })
const sendSMSNotification = async () => { 
      return client.messages
      .create({from: '+12064086250', body: 'study-finf test message', to: '+14704245335'})
      .then(message => console.log(message.sid))
      .done();
};

const sendDatabaseNotification = async (researcherID, studyID) => {
  return firestore.collection("researchers").doc(researcherID).collection("notifications").add({
    time: Date.now(),
    code: CREATE_STUDY,
    meta: { studyID },
  });
};

module.exports = async (snapshot) => {
  const studyID = snapshot.id;
  const researcherID = snapshot.get("researcher.id");

  const researcher = await getDocument(firestore.collection("researchers").doc(researcherID));
  const preference = researcher.notifications.categories.studies;

  if (preference) {
    await Promise.all([sendEmailNotification(), sendSMSNotification(), sendDatabaseNotification(researcherID, studyID)]);
  }
};
