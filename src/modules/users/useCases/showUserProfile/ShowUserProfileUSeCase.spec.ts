import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to show a user's profile", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "cortella@ufmg.br",
      name: "Bruno",
      password: "123456",
    });

    const userProfile = await inMemoryUsersRepository.findById(user.id as string);

    expect(userProfile).toHaveProperty("id");
  });

  it("should not be able to show a non-existent user's profile", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("id_test");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});