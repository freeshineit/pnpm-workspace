/**
 * @description 格式化秒
 * @param {number} seconds 秒
 * @returns {string}
 *
 * @example
 * ```ts
 *  fmtSecondsTime(100) // 01:40
 *  fmtSecondsTime(3700) // 01:01:40
 * ```
 */
function fmtSecondsTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // 格式化为两位数
  const hoursStr = hours < 10 ? "0" + hours : hours;
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  const secondsStr = secs < 10 ? "0" + secs : secs;

  if (+hoursStr <= 0) {
    return `${minutesStr}:${secondsStr}`;
  }

  return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

export { fmtSecondsTime };
