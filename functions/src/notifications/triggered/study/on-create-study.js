const { auth } = require("admin");
const { CREATE_STUDY } = require("../../__utils__/notification-codes");
const { getResearcher, addResearcherNotification } = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");
const sendPhone = require("../../__utils__/send-phone");

module.exports = async (snapshot) => {
  const studyID = snapshot.id;
  const study = snapshot.data();
  const researcherID = study.researcher.id;
  const researcher = await getResearcher(researcherID);

  const subject = "Study Created!";
  const text = `${study.title} has been created`;

  if (researcher?.notifications?.email) {
    const user = await auth.getUser(researcherID);
    const researcherEmail = user.email;
    await sendEmail(
      researcherEmail,
      subject,
      `${text}: ${`/study/${studyID}/details`}\n To unsubscribe from these notifications, please visit: https://studyfind-researcher.firebaseapp.com/account/notifications/`
    );
  }

  if (researcher?.notifications?.phone) {
    const researcherPhone = researcher.phone;
    researcherPhone &&
      /\d\d\d\d\d\d\d\d\d\d/.test(researcherPhone) &&
      (await sendPhone(
        `+1${researcherPhone}`,
        `${text}: ${`/study/${studyID}/details`}\n To unsubscribe visit: https://studyfind-researcher.firebaseapp.com/account/notifications/`
      ));
  }

  return addResearcherNotification(
    researcherID,
    CREATE_STUDY,
    subject,
    text,
    `/study/${studyID}/details`
  );
};
