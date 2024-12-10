const DEFAULT_DELAY_MS = 0

export const sleep = async (time = DEFAULT_DELAY_MS): Promise<void> => {
  await new Promise(res => {
    setTimeout(res, time)
  })
}
