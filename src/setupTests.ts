import "@testing-library/jest-dom/vitest"
import { expect } from "vitest"

import.meta.env.BASE_URL = "http://test.base.url/"

const toHaveParsedTextContent = <T extends {}>(element: HTMLElement, expected: T) => {
  let pass: boolean
  let actual: T
  try {
    // NOTE(harunou): JSON.parse accepts null
    actual = JSON.parse(element.textContent!)
    expect(actual).toMatchObject(expected)
    pass = true
  } catch (error) {
    pass = false
  }

  return {
    pass,
    message: () =>
      pass
        ? `expected element not to have output matching ${JSON.stringify(expected)}, but found ${JSON.stringify(actual)}`
        : `expected element to have output matching ${JSON.stringify(expected)}, but found ${JSON.stringify(actual)}`,
  }
}

expect.extend({
  toHaveOutput: toHaveParsedTextContent,
})
