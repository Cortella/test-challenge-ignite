import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create an user", async () => {
    const user = await createUserUseCase.execute({
      name: "Bruno",
      email: "cortella@ufmg.br",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to register two users with same e-mail", async () => {
     await expect(async () => {
      await createUserUseCase.execute({
        name: "Bruno",
        email: "cortella@ufmg.br",
        password: "123456",
      });

      await createUserUseCase.execute({
        name: "Bruno",
        email: "cortella@ufmg.br",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});