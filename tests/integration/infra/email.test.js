import email from "infra/email.js";

describe("Test infra/email.js", () => {
  test("send()", async () => {
    await email.send({
      from: "MeuBonsai <contato@meubonsai.app>",
      to: "contato@brunononogaki.com",
      subject: "Teste de email",
      text: "Text de corpo",
      // html:
    });
  });
});
