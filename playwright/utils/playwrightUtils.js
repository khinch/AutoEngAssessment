export default class PlaywrightUtils {
  /**
   * @param {import('playwright').Page} page
   */
  static watchConsoleLogs(page) {
    const logs = [];
    page.on("console", (msg) => {
      logs.push(msg.text());
    });
    return logs;
  }
}
