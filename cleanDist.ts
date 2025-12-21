import { existsSync, rmSync } from "node:fs";

const distDir = "./dist";

if (existsSync(distDir)) {
    rmSync(distDir, { recursive: true, force: true });
    console.log(`Successfully cleaned "${distDir}".`);
} else {
    console.log(`Directory "${distDir}" does not exist. Nothing to clean.`);
};