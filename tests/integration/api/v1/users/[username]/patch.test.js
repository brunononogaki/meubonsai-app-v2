import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH to /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With non existent username", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/usuarionaoexiste",
        {
          method: "PATCH",
        },
      );
      expect(response.status).toBe(404);
      const responseUpdateBody = await response.json();
      expect(responseUpdateBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    });
    test("With duplicated username", async () => {
      const userToBeCreated1 = {
        username: "UsernameDuplicado1",
        email: "usernameduplicado1@email.com",
        password: "senha123",
      };

      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userToBeCreated1),
      });
      expect(response1.status).toBe(201);

      const userToBeCreated2 = {
        username: "UsernameDuplicado2",
        email: "usernameduplicado2@email.com",
        password: "senha123",
      };

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userToBeCreated2),
      });
      expect(response2.status).toBe(201);

      const userToBeUpdated = {
        username: "UsernameDuplicado1",
      };

      const responseUpdate = await fetch(
        "http://localhost:3000/api/v1/users/UsernameDuplicado2",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userToBeUpdated),
        },
      );

      expect(responseUpdate.status).toBe(400);

      const responseUpdateBody = await responseUpdate.json();

      expect(responseUpdateBody).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar esta operação.",
        status_code: 400,
      });
    });
    test("With duplicated email", async () => {
      const userToBeCreated1 = {
        username: "UsernameDuplicado3",
        email: "usernameduplicado3@email.com",
        password: "senha123",
      };

      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userToBeCreated1),
      });
      expect(response1.status).toBe(201);

      const userToBeCreated2 = {
        username: "UsernameDuplicado4",
        email: "usernameduplicado4@email.com",
        password: "senha123",
      };

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userToBeCreated2),
      });
      expect(response2.status).toBe(201);

      const userToBeUpdated = {
        email: "usernameduplicado3@email.com",
      };

      const responseUpdate = await fetch(
        "http://localhost:3000/api/v1/users/UsernameDuplicado4",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userToBeUpdated),
        },
      );

      expect(responseUpdate.status).toBe(400);

      const responseUpdateBody = await responseUpdate.json();

      expect(responseUpdateBody).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar esta operação.",
        status_code: 400,
      });
    });
    test("With unique username", async () => {
      const userToBeCreated1 = {
        username: "UniqueEmail1",
        email: "uniqueemail1@email.com",
        password: "senha123",
      };

      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userToBeCreated1),
      });
      expect(response1.status).toBe(201);

      const userToBeUpdated = {
        email: "uniqueemail2@email.com",
      };

      const responseUpdate = await fetch(
        "http://localhost:3000/api/v1/users/UniqueEmail1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userToBeUpdated),
        },
      );

      expect(responseUpdate.status).toBe(200);

      const responseUpdateBody = await responseUpdate.json();

      expect(responseUpdateBody).toEqual({
        id: responseUpdateBody.id,
        username: "UniqueEmail1",
        email: "uniqueemail2@email.com",
        password: responseUpdateBody.password,
        created_at: responseUpdateBody.created_at,
        updated_at: responseUpdateBody.updated_at,
      });

      expect(uuidVersion(responseUpdateBody.id)).toBe(4);
      expect(Date.parse(responseUpdateBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseUpdateBody.created_at)).not.toBeNaN();
      expect(
        responseUpdateBody.updated_at > responseUpdateBody.created_at,
      ).toBe(true);
    });
    test("With unique email", async () => {
      const userToBeCreated1 = {
        username: "UniqueUser1",
        email: "uniqueuser1@email.com",
        password: "senha123",
      };

      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userToBeCreated1),
      });
      expect(response1.status).toBe(201);

      const userToBeUpdated = {
        email: "uniqueuser2@email.com",
      };

      const responseUpdate = await fetch(
        "http://localhost:3000/api/v1/users/UniqueUser1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userToBeUpdated),
        },
      );

      expect(responseUpdate.status).toBe(200);

      const responseUpdateBody = await responseUpdate.json();

      expect(responseUpdateBody).toEqual({
        id: responseUpdateBody.id,
        username: "UniqueUser1",
        email: "uniqueuser2@email.com",
        password: responseUpdateBody.password,
        created_at: responseUpdateBody.created_at,
        updated_at: responseUpdateBody.updated_at,
      });

      expect(uuidVersion(responseUpdateBody.id)).toBe(4);
      expect(Date.parse(responseUpdateBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseUpdateBody.created_at)).not.toBeNaN();
      expect(
        responseUpdateBody.updated_at > responseUpdateBody.created_at,
      ).toBe(true);
    });
    test("With new password", async () => {
      const userToBeCreated1 = {
        username: "NewUserPassword1",
        email: "NewUserPassword1@email.com",
        password: "senha123",
      };

      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userToBeCreated1),
      });
      expect(response1.status).toBe(201);

      const userToBeUpdated = {
        password: "NewPassword",
      };

      const responseUpdate = await fetch(
        "http://localhost:3000/api/v1/users/NewUserPassword1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userToBeUpdated),
        },
      );

      expect(responseUpdate.status).toBe(200);

      const responseUpdateBody = await responseUpdate.json();

      expect(responseUpdateBody).toEqual({
        id: responseUpdateBody.id,
        username: "NewUserPassword1",
        email: "NewUserPassword1@email.com",
        password: responseUpdateBody.password,
        created_at: responseUpdateBody.created_at,
        updated_at: responseUpdateBody.updated_at,
      });

      expect(uuidVersion(responseUpdateBody.id)).toBe(4);
      expect(Date.parse(responseUpdateBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseUpdateBody.created_at)).not.toBeNaN();
      expect(
        responseUpdateBody.updated_at > responseUpdateBody.created_at,
      ).toBe(true);

      // Coleta dos dados do usuário na base e comparação dos hashes das senhas
      const userInDatabase = await user.findOneByUsername("NewUserPassword1");
      const correctPasswordMatch = await password.compare(
        "NewPassword",
        userInDatabase.password,
      );

      const incorrectPasswordMatch = await password.compare(
        "senha123",
        userInDatabase.password,
      );
      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });
  });
});
