const { firestore } = require("admin");
const { getDocument } = require("utils");
const {google} = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const calendar = google.calendar("v3");
const moment = require("moment-timezone");

const googleCredentials = require("./credentials.json");

module.exports.addEventToCalendar = async(snapshot) =>{
    const researcherID  = snapshot.get("ResearcherID");
    const timeZone = await getDocument(firestore.collection("researchers").doc(researcherID)).timeZone;
    const strat = moment.unix(snapshot.get("time")/1000).tz(timeZone).format('YYYY-MM-DDTHH:mm:ss');
    const end = moment.unix(snapshot.get("time")/1000 + 30*60).tz(timeZone).format('YYYY-MM-DDTHH:mm:ss');
    const eventData = {
        evenvtName: snapshot.get("name"),
        startTime: strat,
        endTime: end
    };
    const oAuth2Client = new OAuth2(
        "624561481612-m54akpcb260eu2robisp8bs95sc2l4eg.apps.googleusercontent.com",
        "Pe-j71-TT5mCVuF3RVrLhEHB",
        "https://developers.google.com/oauthplayground"
    );
    const scopes = [
        'https://www.googleapis.com/auth/calendar'
      ];
    
    const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
      
        // If you only need one scope you can pass it as a string
        scope: scopes
    });  
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const {tokens} = await oauth2Client.getToken(code);
    oAuth2Client.setCredentials({
        refresh_token: tokens.refresh_token
    });
    addEvent(eventData,oAuth2Client,timeZone);
}

function addEvent(event,auth,time){
    calendar.events.insert({
        auth:auth,
        calendarId:'Primary',
        resource:{
            'summary':'studyfind meeting reminder',
            'description': event.evenvtName,
            'start':{
                'dateTime': event.startTime,
                'timeZone':time
            },
            'end':{
                'dateTime': event.endTime,
                'timeZone':time
            }
        }
    },(err,res)=>{
        if (err){
            console.log(err);
        }console.log(res.data);
    });
}