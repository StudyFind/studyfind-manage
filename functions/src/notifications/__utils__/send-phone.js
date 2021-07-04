const { RestClient } = require("@signalwire/node");

const projectId = "27ada9cd-27a2-4f87-83c6-87de33c37404";
const projectToken = "PTa5c0e106704976843e94000e800faa36cdd3452beb464b0e";
const spaceUrl = "studyfind-test.signalwire.com";

const client = new RestClient(projectId, projectToken, { signalwireSpaceUrl: spaceUrl });

module.exports = async (to, subject, text) => {
  return client.messages.create({ from: "+12064086250", body: `${subject}\n\n${text}`, to }).done();
};
