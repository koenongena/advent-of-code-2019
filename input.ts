import fetch from "node-fetch";
import * as dotenv from 'dotenv';
import * as fs from "fs";
import R = require("ramda");

dotenv.config()

const readFile = require('util').promisify(fs.readFile)
const getDownloadUrl = day => `https://adventofcode.com/2019/day/${day}/input`;
const downloadFile = async (url, destination) => {
    console.log("Downloading file " + url + " to " + destination);
    const fileStream = fs.createWriteStream(destination);
    const res = await fetch(url, {
        headers: {
            cookie: process.env.COOKIE
        }
    })

    return new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", (err) => {
            fileStream.close();
            reject(err);
        });
        fileStream.on("finish", function () {
            fileStream.close();
            resolve(destination);
        });
    });

};
const getFilePath = (day) => (url) => {
    const filePath = `./input/day${day}.txt`;
    if (fs.existsSync(filePath)) {
        console.log("Filepath " + filePath + " exists");
        return Promise.resolve(filePath);
    } else {
        fs.mkdirSync('./input');
    }


    return downloadFile(url, filePath);
};

const splitLines = R.pipe(R.toString, R.trim, R.split('\n'));
const readLines = R.pipe(readFile, R.andThen(splitLines));

export const readLinesForDay = (day) => {
    const determineFilePath = getFilePath(day);

    return R.pipe(
        getDownloadUrl,
        determineFilePath,
        R.andThen(readLines)
    )(day);
}
