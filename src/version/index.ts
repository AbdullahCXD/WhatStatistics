import semver from "semver";
import axios from "axios";
import { readFileSync } from "fs";
import path from "path";
import { ready, warn } from "../utils";

export class VersionChecking {

    private static GITHUB_REPO_URL = "https://github.com/AbdullahCXD/WhatStatistics";
    private static GITHUB_URL = this.GITHUB_REPO_URL + "/raw/refs/heads/development/VERSION";

    static async checkVersion() {
        const gitVersion = await this.getVersion();
        const currentVersion = readFileSync(path.join(process.cwd(), "VERSION"), "utf-8");
        const comparison = semver.compare(currentVersion, gitVersion);

        if (comparison == -1) {
            warn("The current build of the project is outdated, please check out the repository for updates.");
            warn("Repository: " + this.GITHUB_REPO_URL);
        } else if (comparison == 1) {
            warn("Unknown version of WS (WhatStatistics), please review the files and version from the repository before using this.");
            warn("Repository: " + this.GITHUB_REPO_URL);
        } else {
            ready("Version checking complete!")
        }
    }

    static async getVersion() {
        const data = await axios.get(this.GITHUB_URL);
        return data.data as string;
    }

}