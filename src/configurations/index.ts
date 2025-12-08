import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { parse, stringify } from "yaml";

export class ConfigurationManager {

    private static configurationsDirectory = path.join(process.cwd(), `configurations`);

    static createConfiguration<T>(name: string, value: T): T {
        
        const p = path.join(this.configurationsDirectory, name + '.yml');
        if (existsSync(p)) return this.loadConfiguration(name)!;

        const content = stringify(value);

        writeFileSync(p, content);

        return value;

    }

    static loadConfiguration<T>(name: string): T | undefined {
        
        const p = path.join(this.configurationsDirectory, name + '.yml');

        if (!existsSync(p)) return undefined;

        const content = readFileSync(p, "utf-8");
        const yaml = parse(content);

        return yaml as T;

    }

}