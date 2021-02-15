import fetch from "node-fetch";
import * as dotenv from 'dotenv';
import * as fs from "fs";
import * as readline from "readline";

dotenv.config()

export const getFilePath = async (day) => {
    const filePath = `./day${day}.txt`;
    if (fs.existsSync(filePath)) {
        return filePath;
    }

    const fileStream = fs.createWriteStream(`./day${day}.txt`);
    const res = await fetch(`https://adventofcode.com/2019/day/${day}/input`, {
        headers: {
            cookie: process.env.COOKIE}
    })

    return new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", (err) => {
            fileStream.close();
            reject(err);
        });
        fileStream.on("finish", function () {
            fileStream.close();
            resolve(filePath);
        });
    });
}

export const readLines = (filePath) => {
    const readInterface = readline.createInterface(
        fs.createReadStream(filePath),
        null
    );

    const lines = [];
    return new Promise<string[]>((resolve, reject) => {
        readInterface.on("line", input => {
            lines.push(input);
        });
        readInterface.on("close", () => {
            resolve(lines);
        });
    });
}

export const readLinesForDay = async (day) => {
    return await readLines(await getFilePath(day));
}
