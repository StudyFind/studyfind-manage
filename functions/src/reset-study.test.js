jest.mock("axios");
jest.mock("./firebase/verify-id-token");
jest.mock("./firebase/get-user");
jest.mock("./firebase/update-firestore-entry.js");
jest.mock("./firebase/get-firestore-entry.js");

const mAxios = require("axios");
const mVerifyIdToken = require("./firebase/verify-id-token");
const mGetUser = require("./firebase/get-user");
const mUpdateFirestoreEntry = require("./firebase/update-firestore-entry");
const mGetFirestoreEntry = require("./firebase/get-firestore-entry");

const admin = require("firebase-admin");
admin.initializeApp();
const context = { admin };
const Func = require("./reset-study");

describe("update-study", () => {
    let func;
    let req;
    let res;

    beforeEach(async () => {
        func = Func(context);
        req = { query: { nctID: "NCTID", idToken: "IDTOKEN" } };
        res = { json: jest.fn(), status: jest.fn(), set: jest.fn() };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it("responds with json", async () => {
        await func(req, res);

        expect(res.json).toHaveBeenCalledTimes(1);
    });

    it("responds with error on bad request", async () => {
        await func(req, res);

        const resp = res.json.mock.calls[0][0];
        expect(resp.error).not.toBeNull();
        expect(resp.error).not.toBeUndefined();
    });

    it("updates a study while persisting data", async () => {
        mAxios.get.mockImplementationOnce(mAxiosGetStudy);
        mVerifyIdToken.mockImplementationOnce(async (admin, idToken) => ({
            uid: "TEST_UID"
        }))
        mGetUser.mockImplementationOnce(async (auth, uid) => ({
            uid,
            displayName: "TEST_USER",
            email: "TEST_EMAIL",
        }));
        mGetFirestoreEntry.mockImplementationOnce(async (firestore, collection, doc) => ({
            researcher: {
                id: "TEST_UID"
            }
        }))

        await func(req, res);

        expect(res.json).toHaveBeenCalledTimes(1);
        const resp = res.json.mock.calls[0][0];
        expect(resp.error).toBeNull();
        expect(resp.nctID).not.toBeNull();
        expect(resp.study).not.toBeNull();

        expect(mUpdateFirestoreEntry).toHaveBeenCalledTimes(1);
        expect(mUpdateFirestoreEntry.mock.calls[0][0].document).toBe("NCTID");
        const entry = mUpdateFirestoreEntry.mock.calls[0][0].data;
        expect(entry.nctID).toBeUndefined();
        expect(entry.description).toBeUndefined();
        expect(entry.published).toBeUndefined();
        expect(entry.updatedAt).not.toBeUndefined();
    });

    it("disallow update from non-owning user", async () => {
        mAxios.get.mockImplementationOnce(mAxiosGetStudy);
        mVerifyIdToken.mockImplementationOnce(async (admin, idToken) => ({
            uid: "DIFFERENT_TEST_UID"
        }))
        mGetUser.mockImplementationOnce(async (auth, uid) => ({
            uid,
            displayName: "DIFFERENT_TEST_USER",
            email: "DIFFERENT_TEST_EMAIL",
        }));
        mGetFirestoreEntry.mockImplementationOnce(async (firestore, collection, doc) => ({
            researcher: {
                id: "TEST_UID"
            }
        }));

        await func(req, res);

        expect(res.json).toHaveBeenCalledTimes(1);
        const resp = res.json.mock.calls[0][0];
        expect(resp.error).not.toBeNull();
        expect(resp.error).not.toBeUndefined();

        expect(mUpdateFirestoreEntry).toHaveBeenCalledTimes(0);
    });
});


// useful axios mock implementation for getting study
const mAxiosGetStudy = async (url) => ({
    data: {
        status: "success",
        study: {
            additionalCriteria:
                "Inclusion Criteria:\n\n\nA diagnosis of advanced COVID-19 as defined both of the following:\n\nas a positive test for SARS-CoV-2 RNA detected by RT-PCR collected from the upper respiratory tract (e.g. nasopharyngeal, nasal, oropharyngeal swab, or saliva) and, if possible, the lower respiratory tract (sputum, tracheal aspirate, or bronchoalveolar lavage), analyzed by a CLIA certified lab with an FDA approved assay.\n\nCritical disease manifested by any of the following:\n\nChest imaging with >= 50% lung involvement\nRespiratory failure requiring invasive mechanical ventilation, non-invasive mechanical ventilation (eg. BiPAPA, OptiFlow), supplementary oxygen with FiO2 >= 6 LPM or extracorporeal membrane oxygenation (ECMO)\nShock - defined as mean arterial pressure <= 65 mmHg unresponsive to 25ml/kg isotonic intravenous fluid resuscitation and/or requiring vasopressor support\n\nCardiac dysfunction defined by:\n\nNew global systolic dysfunction with ejection fraction <= 40%\nTakotsubo cardiomyopathy\n\n\n\n\n\n\nPatients who have received prior investigational or off-label agents for COVID-19 does not exclude eligibility.\nAt least 18 years of age at the time of study registration\nAdequate hematologic function defined as absolute neutrophil count >=1000/mm3 and platelet count >= 50,000/mm3 without growth factor or transfusion support for 7 days prior to screening.\nCreatinine-clearance >= 15 mL/minute or receiving renal replacement therapy\nAminotransferase (AST/ALT) levels <3x the upper limit of normal\nAble to understand and willing to sign an IRB approved written informed consent document (or that of legally authorized representative, if applicable)\nWomen of childbearing potential (defined as women with regular menses, women with amenorrhea, women with irregular cycles, women using a contraceptive method that precludes withdrawal bleeding, or women who have had a tubal ligation) are required to have a negative pregnancy test and use two forms of acceptable contraception, including one barrier method, during participation in the study treatment period.\nMale patients if engaging in sex with a women of childbearing potential are required to use two forms of acceptable contraception, including one barrier method, during participation in the study and throughout the evaluation period.\n\nExclusion Criteria:\n\nKnown allergy or intolerance to duvelisib or another PI3K inhibitor.\nKnown or suspected active viral (including CMV, HIV, hepatitis B, and hepatitis C), bacterial, mycobacterial, or fungal infection other than COVID-19. CMV viral load will be assessed at screening and those with viremia will be excluded. Other virologic testing not required unless infection is suspected.\nPregnant and/or breastfeeding.\nAny uncontrolled intercurrent illness that would put the patient at greater risk or limit compliance with study requirements in the opinion of the investigator.",
            conditions: ["COVID-19"],
            contactEmail: "TEST_EMAIL",
            contactName: "John DiPersio, M.D., Ph.D.",
            control: "No",
            locations: [
                {
                    latitude: 38.6351441,
                    localLocation: "Washington University School of Medicine",
                    longitude: -90.26292889999999,
                    nationalLocation: "Saint Louis, Missouri, United States, 63110",
                },
            ],
            longDescription: "",
            maxAge: 100,
            minAge: 18.0,
            nctID: "NCTID",
            recruitmentStatus: "Recruiting",
            sex: "All",
            shortDescription:
                "The exceedingly high mortality rates of severe and critical COVID-19 warrant the identification and evaluation of novel therapies that could potentially mitigate the advanced disease manifestations. Based on preclinical data from this institution and others, the investigators hypothesize that PI3K inhibition with duvelisib could potentially quell aberrant hyperactivtation of the innate immune system, preferentially polarize macrophages, reduce pulmonary inflammation, and limit viral persistence, thereby improving patient outcomes.",
            sponsor: "Washington University School of Medicine",
            title: "Duvelisib to Combat COVID-19",
            type: "Interventional",
        },
    },
});