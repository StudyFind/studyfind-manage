jest.mock("axios");

const axios = require("axios");

const admin = require("./__mocks__/admin");
const firestore = admin.firestore();
const auth = admin.auth();

const context = { admin };
const Func = require("./welcome-account");

describe("welcome-account", () => {
    let func;
    let req;
    let res;

    beforeEach(async () => {
        func = Func(context);
        req = { url: "", query: {} };
        res = { json: jest.fn(), status: jest.fn(), set: jest.fn() };
    });

    afterEach(() => {
        jest.clearAllMocks();
        firestore.reset();
        auth.reset();
    });

    it('throws no errors while running', async () => {
        // make sure all mocks are working
        firestore.data = mFirestore();
        auth.data = mAuth();
        axios.get.mockImplementationOnce(mAxiosGetStudies);
        req.query.idToken = "TEST_USER";

        await func(req, res);
    });

    it('updates firestore with all scraped studies', async () => {
        firestore.data = mFirestore();
        auth.data = mAuth();
        axios.get.mockImplementationOnce(mAxiosGetStudies);
        req.query.idToken = "TEST_USER";

        await func(req, res);

        const studies = await firestore.collection('studies').get();
        expect(studies.empty).toBe(false);
        expect(studies.length).toBe(1);
        const study = studies[0].data();
        expect(study.nctID).toBe("TEST_NCTID");
        expect(study.researcher.id).toBe("TEST_USER");
    });

    it('creates studies as unpublished by default', async () => {
        firestore.data = mFirestore();
        auth.data = mAuth();
        axios.get.mockImplementationOnce(mAxiosGetStudies);
        req.query.idToken = "TEST_USER";

        await func(req, res);

        const studies = await firestore.collection('studies').get();
        const study = studies[0].data();
        expect(study.published).toBe(false);
    });

    it('returns json success and all studies list', async () => {
        firestore.data = mFirestore();
        auth.data = mAuth();
        axios.get.mockImplementationOnce(mAxiosGetStudies);
        req.query.idToken = "TEST_USER";

        await func(req, res);

        expect(res.json).toHaveBeenCalled();
        const resp = res.json.mock.calls[0][0];
        expect(resp.error).toBeNull();
        expect(resp.studies).toHaveLength(1);
    });
});


// useful general firestore mock
const mFirestore = () => ({
    collection: {
        studies: {},
    }
})

// useful general auth mock
const mAuth = () => ({
    "TEST_USER": {
        uid: "TEST_USER",
        emai: "TEST_EMAIL",
    }
})

// useful axios mock for mocking get study
const mAxiosGetStudies = async (url) => ({
    data: {
        status: "success",
        studies: [{
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
            nctID: "TEST_NCTID",
            recruitmentStatus: "Recruiting",
            sex: "All",
            shortDescription:
                "The exceedingly high mortality rates of severe and critical COVID-19 warrant the identification and evaluation of novel therapies that could potentially mitigate the advanced disease manifestations. Based on preclinical data from this institution and others, the investigators hypothesize that PI3K inhibition with duvelisib could potentially quell aberrant hyperactivtation of the innate immune system, preferentially polarize macrophages, reduce pulmonary inflammation, and limit viral persistence, thereby improving patient outcomes.",
            sponsor: "Washington University School of Medicine",
            title: "Duvelisib to Combat COVID-19",
            type: "Interventional",
        }],
    },
});