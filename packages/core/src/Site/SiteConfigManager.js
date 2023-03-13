const fs = require('fs-extra');
const path = require('path');

const SiteConfig = require('./SiteConfig');
const { SITE_CONFIG_NAME } = require('./constants');
const { LAYOUT_DEFAULT_NAME } = require('../Layout');

class SiteConfigManager {
  constructor(rootPath, siteConfigPath) {
    this.rootPath = rootPath;
    this.siteConfigPath = siteConfigPath;
  }

  /**
   * Read and store the site config from site.json, overwrite the default base URL
   * if it's specified by the user.
   * @param baseUrl user defined base URL (if exists)
   * @returns {Promise}
   */
  async readSiteConfig(baseUrl) {
    try {
      const siteConfigPath = path.join(this.rootPath, this.siteConfigPath);
      const siteConfigJson = fs.readJsonSync(siteConfigPath);
      return new SiteConfig(siteConfigJson, baseUrl);
    } catch (err) {
      throw (new Error(`Failed to read the site config file '${this.siteConfigPath}' at`
        + `${this.rootPath}:\n${err.message}\nPlease ensure the file exist or is valid`));
    }
  }

  /**
   * Applies the default layout to all addressable pages by modifying the site config file.
   */
  async addDefaultLayoutToSiteConfig() {
    const configPath = path.join(this.rootPath, SITE_CONFIG_NAME);
    const config = await fs.readJson(configPath);
    await this.writeToSiteConfig(config, configPath);
  }

  /**
   * Helper function for addDefaultLayoutToSiteConfig().
   */
  static async writeToSiteConfig(config, configPath) {
    const layoutObj = { glob: '**/*.md', layout: LAYOUT_DEFAULT_NAME };
    config.pages.push(layoutObj);
    await fs.outputJson(configPath, config);
  }
}

module.exports = {
  SiteConfigManager,
};
