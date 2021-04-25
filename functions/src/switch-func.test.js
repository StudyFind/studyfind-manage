jest.mock('./utils/switch-list');

const mSwitchList = require('./utils/switch-list');

const admin = require("firebase-admin");
admin.initializeApp();
const context = { admin };
const Func = require("./switch-func");


describe("switch-func", () => {
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
    });


    it("responds with json", async () => {
        await func(req, res);

        expect(res.json).toHaveBeenCalledTimes(1);
    });

    it("responds with error on bad request", async () => {
        await func(req, res);

        let resp = res.json.mock.calls[0][0];
        expect(resp.error).not.toBeNull();
        expect(resp.error).not.toBeUndefined();

        req.url += "/NON_EXISTING_FUNC";
        await func(req, res);

        resp = res.json.mock.calls[0][0];
        expect(resp.error).not.toBeNull();
        expect(resp.error).not.toBeUndefined();
    });

    it("properly inits with context", async () => {
        // this.beforeEach already inits each func
        expect(mSwitchList.TEST_FUNC).toHaveBeenCalledTimes(1);
        const arg = mSwitchList.TEST_FUNC.mock.calls[0][0];
        expect(arg).toBe(context);
    });

    it("calls correct func with right arguments", async () => {
        req.url += "/TEST_FUNC";
        await func(req, res);

        expect(res.json).toHaveBeenCalledTimes(0);

        expect(mSwitchList.TEST_FUNC).toHaveBeenCalledTimes(2);
        const [retReq, retRes] = mSwitchList.TEST_FUNC.mock.calls[1]
        expect(retReq.url).toBe("/");
        expect(retRes).toBe(res);
    });

    it("handles additional url subroutes", async () => {
        req.url += "/TEST_FUNC/SUBROUTE";
        await func(req, res);

        expect(res.json).toHaveBeenCalledTimes(0);

        expect(mSwitchList.TEST_FUNC).toHaveBeenCalledTimes(2);
        const [retReq, retRes] = mSwitchList.TEST_FUNC.mock.calls[1]
        expect(retReq.url).toBe("/SUBROUTE");
        expect(retRes).toBe(res);
    });

    it("handles additional url parameters", async () => {
        req.url += "/TEST_FUNC?param=1";
        await func(req, res);

        expect(res.json).toHaveBeenCalledTimes(0);

        expect(mSwitchList.TEST_FUNC).toHaveBeenCalledTimes(2);
        const [retReq, retRes] = mSwitchList.TEST_FUNC.mock.calls[1]
        expect(retReq.url).toBe("/?param=1");
        expect(retRes).toBe(res);
    });

});