const admin = require("./__mocks__/admin");
const firestore = admin.firestore();
const auth = admin.auth();

const context = { admin };
const Func = require("./meeting-runner");

describe("meeting-runner", () => {
    let func;

    beforeEach(async () => {
        func = Func(context);
    });

    afterEach(() => {
        jest.clearAllMocks();
        firestore.reset();
        auth.reset();
    });

    it("calls all proper functions", async () => {
        firestore.data = mFirestore();
        auth.data = mAuth();
        jest.spyOn(global.Date, "now").mockReturnValueOnce(1000 * 60 * 30);

        await func();

        expect(firestore.collection).toHaveBeenCalled();
        expect(firestore.get).toHaveBeenCalled();
        expect_or(
            () => expect(firestore.set).toHaveBeenCalled(),
            () => expect(firestore.add).toHaveBeenCalled(),
        );
    });

    it("creates a researcher notification", async () => {
        firestore.data = mFirestore();
        auth.data = mAuth();
        jest.spyOn(global.Date, "now").mockReturnValueOnce(1000 * 60 * 30);

        await func();

        const snap = await firestore
            .collection("researchers").doc("TEST_RESEARCHER_ID")
            .collection("notifications").get();
        expect(snap.empty).toBe(false);
    });

    it("creates a participant notification", async () => {
        firestore.data = mFirestore();
        auth.data = mAuth();
        jest.spyOn(global.Date, "now").mockReturnValueOnce(1000 * 60 * 30);

        await func();

        const snap = await firestore
            .collection("participants").doc("TEST_PARTICIPANT_ID")
            .collection("notifications").get();
        expect(snap.empty).toBe(false);
    });

    it("creates an email to both participant and researcher", async () => {
        firestore.data = mFirestore();
        auth.data = mAuth();
        jest.spyOn(global.Date, "now").mockReturnValueOnce(1000 * 60 * 30);

        await func();

        const snap = await firestore.collection("mail").get();
        expect(snap.empty).toBe(false);
        expect(snap.length).toBe(2);
        const [a, b] = [snap[0].data(), snap[1].data()];
        expect_or(
            () => expect(a.to).toBe("TEST_RESEARCHER_EMAIL"),
            () => expect(b.to).toBe("TEST_RESEARCHER_EMAIL")
        );
        expect_or(
            () => expect(a.to).toBe("TEST_PARTICIPANT_EMAIL"),
            () => expect(b.to).toBe("TEST_PARTICIPANT_EMAIL")
        )
    });

    it("notifies for all meetings in past 30 minutes", async () => {
        firestore.data = mFirestore();
        auth.data = mAuth();
        jest.spyOn(global.Date, "now").mockReturnValueOnce(1000 * 60 * 35); // 35 minutes

        await func();

        const snap = await firestore
            .collection("participants").doc("TEST_PARTICIPANT_ID")
            .collection("notifications").get();
        expect(snap.empty).toBe(false);
        const notification = snap[0].data();
        expect(notification.time).toBe(1000*60*35); // preserve time
    });

});

const mFirestore = () => ({
    collection: {
        studies: {
            "TEST_STUDY_ID": {
                nctID: "TEST_STUDY_ID",
                researcher: {
                    id: "TEST_RESEARCHER_ID",
                }
            }
        },
        researchers: {
            "TEST_RESEARCHER_ID": {}
        },
        participants: {
            "TEST_PARTICIPANT_ID": {}
        },
        meetings: {
            "TEST_MEETING_ID": {
                name: "TEST_MEETING_NAME",
                link: "TEST_MEETING_LINK",
                participantID: "TEST_PARTICIPANT_ID",
                studyID: "TEST_STUDY_ID",
                time: 1000 * 60 * 30, // 30 mins
            }
        }
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


// jest utility func for expecting one of multiple conditions
function expect_or(...tests) {
    try {
        tests.shift()();
    } catch (e) {
        if (tests.length) expect_or(...tests);
        else throw e;
    }
}