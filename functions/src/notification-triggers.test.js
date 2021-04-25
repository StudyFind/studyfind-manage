const admin = require("./__mocks__/admin");
const firestore = admin.firestore();
const auth = admin.auth();

const context = { admin };
const Funcs = require("./notification-triggers");


// describe each function individually

describe("notification-triggers onCreateStudy", () => {
    let func;

    beforeEach(async () => {
        func = Funcs.onCreateStudy(context);
    });

    afterEach(() => {
        jest.clearAllMocks();
        firestore.reset();
        auth.reset();
    });

    it("writes notification", async () => {
        firestore.data = mFirestore();
        auth.data = mAuth();
        jest.spyOn(global.Date, 'now').mockReturnValueOnce(1000);
        const newStudy = await firestore.collection("studies").doc("TEST_STUDY").get();
        const event = mEvent({ studyID: "TEST_STUDY" })

        await func(newStudy, event);

        expect_or(
            () => expect(firestore.add).toHaveBeenCalled(),
            () => expect(firestore.set).toHaveBeenCalled(),
        );
        const notifications = await firestore
            .collection("researchers").doc("TEST_RESEARCHER_ID")
            .collection("notifications").get();
        expect(notifications.empty).toBe(false);
        const notification = notifications[0].data();
        expect(notification.time).toBe(1000);
        expect(notification.read).toBe(false);
        expect(notification.title).toBeDefined();
        expect(notification.description).toBeDefined();
        expect(notification.type).toBeDefined();
    });

    it("writes an email", async () => {
        firestore.data = mFirestore();
        auth.data = mAuth();
        jest.spyOn(global.Date, "now").mockReturnValueOnce(1000);
        const newStudy = await firestore.collection("studies").doc("TEST_STUDY").get();
        const event = mEvent({studyID: "TEST_STUDY"});

        await func(newStudy, event);

        const mail = await firestore.collection("mail").get();
        expect(mail.empty).toBe(false);
    });
});

describe("notification-triggers onDeleteStudy", () => {
    let func;

    beforeEach(async () => {
        func = Funcs.onDeleteStudy(context);
    });

    afterEach(() => {
        jest.clearAllMocks();
        firestore.reset();
        auth.reset();
    });

    it("writes notification", async () => {
        firestore.data = mFirestore();
        auth.data = mAuth();
        const deletedStudy = await firestore.collection("studies").doc("TEST_STUDY").get();
        const event = mEvent({ studyID: "TEST_STUDY" });

        await func(deletedStudy, event);

        expect_or(
            () => expect(firestore.set).toHaveBeenCalled(),
            () => expect(firestore.add).toHaveBeenCalled(),
        );
        const notifications = await firestore
            .collection("researchers").doc("TEST_RESEARCHER_ID")
            .collection("notifications").get();
        expect(notifications.empty).toBe(false);
    });

    it("writes email", async () => {
        firestore.data = mFirestore();
        auth.data = mAuth();
        const deletedStudy = await firestore.collection("studies").doc("TEST_STUDY").get();
        const event = mEvent({ studyID: "TEST_STUDY" });

        await func(deletedStudy, event);

        const mail = await firestore.collection("mail").get();
        expect(mail.empty).toBe(false);
    });
});

describe("notification-triggers onNewParticipant", () => {
    let func;

    beforeEach(async () => {
        func = Funcs.onNewParticipant(context);
    });

    afterEach(() => {
        jest.clearAllMocks();
        firestore.reset();
        auth.reset();
    });

    it("writes notifications", async () => {
        firestore.data = mFirestore();
        auth.data = mAuth();
        const newParticipant = await firestore
            .collection("studies").doc("TEST_STUDY")
            .collection("participants").doc("TEST_PARTICIPANT_ID").get();
        const event = mEvent({ studyID: "TEST_STUDY", participantID: "TEST_PARTICIPANT_ID" });

        await func(newParticipant, event);

        expect_or(
            () => expect(firestore.set).toHaveBeenCalled(),
            () => expect(firestore.add).toHaveBeenCalled(),
        );
        const notifications = await firestore
            .collection("researchers").doc("TEST_RESEARCHER_ID")
            .collection("notifications").get();
        expect(notifications.empty).toBe(false);
    });

    it("writes mail", async () => {
        firestore.data = mFirestore();
        auth.data = mAuth();
        const newParticipant = await firestore
            .collection("studies").doc("TEST_STUDY")
            .collection("participants").doc("TEST_PARTICIPANT_ID").get();
        const event = mEvent({ studyID: "TEST_STUDY", participantID: "TEST_PARTICIPANT_ID" });

        await func(newParticipant, event);

        const mail = await firestore.collection("mail").get();
        expect(mail.empty).toBe(false);
    });
});

describe("notification-triggers onCreateResearcherAccount", () => {
    let func;

    beforeEach(async () => {
        func = Funcs.onCreateResearcherAccount(context);
    });

    afterEach(() => {
        jest.clearAllMocks();
        firestore.reset();
        auth.reset();
    });

    it("writes notifications", async () => {
        firestore.data = mFirestore();
        auth.data = mAuth();
        const newResearcher = await firestore
            .collection("researchers").doc("TEST_RESEARCHER_ID")
            .get();
        const event = mEvent({ researcherID: "TEST_RESEARCHER_ID" });

        await func(newResearcher, event);

        expect_or(
            () => expect(firestore.set).toHaveBeenCalled(),
            () => expect(firestore.add).toHaveBeenCalled(),
        );
        const notifications = await firestore
            .collection("researchers").doc("TEST_RESEARCHER_ID")
            .collection("notifications").get();
        expect(notifications.empty).toBe(false);
    });

    it("writes mail", async () => {
        firestore.data = mFirestore();
        auth.data = mAuth();
        const newResearcher = await firestore
            .collection("researchers").doc("TEST_RESEARCHER_ID")
            .get();
        const event = mEvent({ researcherID: "TEST_RESEARCHER_ID" });

        await func(newResearcher, event);

        const mail = await firestore.collection("mail").get();
        expect(mail.empty).toBe(false);
    });
});

// default firestore data mock
const mFirestore = () => ({
    collection: {
        // studies firestore collection
        studies: {
            "TEST_STUDY": {
                nctID: "TEST_STUDY",
                researcher: {
                    id: "TEST_RESEARCHER_ID",
                },
                collection: {
                    "participants": {
                        "TEST_PARTICIPANT_ID": {
                            fakename: "TEST_FAKE_NAME",
                            status: "accepted",
                        }
                    },
                }
            }
        },
        // researchers firestore collection
        researchers: {
            "TEST_RESEARCHER_ID": {
                collection: {
                    "notifications": {},
                }
            }
        },
        // participants firestore collection
        participants: {
            "TEST_PARTICIPANT_ID": {
                collection: {
                    "notifications": {},
                }
            }
        },
    }
});


const mAuth = () => ({
    "TEST_RESEARCHER_ID": {
        email: "TEST_RESEARCHER_EMAIL",
    },
    "TEST_PARTICIPANT_ID": {
        email: "TEST_PARTICIPANT_EMAIL",
    }
});


const mEvent = (params = {}) => ({
    eventId: "TEST_EVENT_ID",
    timestamp: "2021-02-16T16:15:13.259Z",
    eventType: "TEST_EVENT_TYPE",
    params: params,
});

// jest utility func for expecting one of multiple conditions
function expect_or(...tests) {
    try {
        tests.shift()();
    } catch (e) {
        if (tests.length) expect_or(...tests);
        else throw e;
    }
}