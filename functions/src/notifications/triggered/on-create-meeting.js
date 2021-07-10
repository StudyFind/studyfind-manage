const { firestore } = require("admin");
const { getDocument } = require("utils");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const calendar = google.calendar("v3");
const moment = require("moment-timezone");

function convertToGoogleTimestamp(timestamp, timezone) {
  return moment.unix(timestamp).tz(timezone).format("YYYY-MM-DDTHH:mm:ss");
}

module.exports.addEventToCalendar = async (snapshot) => {
  const researcherID = snapshot.get("researcherID");
  const meetingName = snapshot.get("name");
  const meetingTime = snapshot.get("time");

  const researcherDoc = await getDocument(firestore.collection("researchers").doc(researcherID));
  const timezone = researcherDoc.timezone;

  const startTime = convertToGoogleTimestamp(meetingTime / 1000, timezone);
  const endTime = convertToGoogleTimestamp(meetingTime / 1000 + 30 * 60, timezone);

  const eventData = {
    eventName: meetingName,
    startTime,
    endTime,
  };

  const oAuth2Client = new OAuth2(
    "624561481612-m54akpcb260eu2robisp8bs95sc2l4eg.apps.googleusercontent.com",
    "Pe-j71-TT5mCVuF3RVrLhEHB",
    "https://developers.google.com/oauthplayground"
  );

  const scopes = ["https://www.googleapis.com/auth/calendar"];

  const url = oAuth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",

    // If you only need one scope you can pass it as a string
    scope: scopes,
  });

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials({
    refresh_token: tokens.refresh_token,
  });

  addEvent(eventData, oAuth2Client, timezone);
};

function addEvent(event, auth, timezone) {
  calendar.events.insert(
    {
      auth: auth,
      calendarId: "Primary",
      resource: {
        summary: "studyfind meeting reminder",
        description: event.evenvtName,
        start: {
          dateTime: event.startTime,
          timeZone: timezone,
        },
        end: {
          dateTime: event.endTime,
          timeZone: timezone,
        },
      },
    },
    (err, res) => {
      if (err) {
        console.log(err);
      }
      console.log(res.data);
    }
  );
}
