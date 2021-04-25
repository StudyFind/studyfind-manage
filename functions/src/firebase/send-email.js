const defaultMessageObject = {
    subject: "Test Email from StudyFind",
    html: "This is a test email. If you are recieving this, please contact StudyFind and make them aware of this issue."
};

/**
 * Inserts email into firestore when given user id, checks their settings file to make sure they
 * haven't turned email notifications off
 * @param {admin.firestore} firestore - Firestore ref object
 * @param {admin.auth} auth - Authentication object
 * @param {string} uid stringified user uid to send email to
 * @param {Object} messageObject Object containing subject and html fields describing email
 * @param {bool} isResearcher Whether user is a researcher or not (need to check their settings)
 * @returns Promise of firestore mail insert
 */
module.exports = async (firestore, auth, uid, messageObject=defaultMessageObject, isResearcher=true) => {
    // add unsubscribe message
    messageObject.html += '<h6><a href="https://studyfind.org/settings">Click here to change your email preferences and unsubscribe</a><h6>';

    const [user, userData] = await Promise.all([
        auth.getUser(uid)
            .then(u => {
                if (!u.email) throw TypeError(`no email exists for user ${uid}`);
                return u
            }),
        firestore.collection(isResearcher ? 'researchers' : 'participants').doc(uid).get()
            .then(d => {
                if (!d.exists) throw TypeError(`'${uid}, is-researcher ${isResearcher}; does not have a firestore entry`);
                return d.data()
            }),
    ]);
    if (userData.emailNotifications === false) return null;
    return firestore.collection("mail").add({
        to: user.email,
        message: messageObject,
    });
}