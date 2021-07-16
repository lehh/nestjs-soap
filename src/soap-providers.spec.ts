import { createProviders } from "./soap-providers";

describe('SoapProviders', () => {
  const PROVIDER_OPTIONS = [
    {
      uri: "FOO",
      connectionName: "FOO",
    },
    {
      uri: "BAR",
      connectionName: "BAR",
    }
  ]

  test("should return providers", () => {
    const providers = createProviders(PROVIDER_OPTIONS);

    expect(providers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          provide: "FOO",
        }),
        expect.objectContaining({
          provide: "BAR",
        })
      ])
    )
  })

  test("should return async option providers", () => {
    const providers = createProviders(PROVIDER_OPTIONS);

    expect(providers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          provide: "FOO",
        }),
        expect.objectContaining({
          provide: "BAR",
        })
      ])
    )
  })

});
