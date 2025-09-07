import imageTransform from "../utils/imageTransform";
import app from "../index";
import supertest from "supertest";
import { console } from "inspector";

describe("Testing endpoint response", () => {
  const request = supertest(app);

  it("gets the api/images endpoint", async () => {
    const response = await request.get("/api/images");
    expect(response.status).toBe(200);
  });
});

describe("Image transform function should resolve or reject", () => {
  it("Expect imageTransform to return new image path", async () => {
    const result = await imageTransform("cat1", "350", "350");
    console.log(result);
    await expect(result).toBeTruthy();
  });

  it("Expect transform to throw missing filename error", async () => {
    const promise = imageTransform("", "350", "350");
    await expectAsync(promise).toBeRejectedWithError(
      "Missing filename parameter",
    );
  });

  it("Expect transform to throw width/height must be numbers error", async () => {
    const promise = imageTransform("cat1", "350", "a");
    await expectAsync(promise).toBeRejectedWithError(
      "Width and height must be positive numbers",
    );
  });

  it("Expect transform to throw width/height must be positive error", async () => {
    const promise = imageTransform("cat1", "350", "-350");
    await expectAsync(promise).toBeRejectedWithError(
      "Width and height must be positive numbers",
    );
  });
});
