/* eslint-disable no-console */
// write code here
const fs = require('fs/promises');
const path = require('path');

async function validateSource(source) {
  const sourceStat = await fs.stat(source);

  if (!sourceStat.isFile()) {
    throw new Error('Source is not a file');
  }
}

async function setDestPath(destination, source) {
  let destPath;

  if (destination.endsWith('/')) {
    try {
      const destStat = await fs.stat(destination);

      if (!destStat.isDirectory()) {
        throw new Error('Destination is not a directory');
      }

      destPath = path.join(destination, path.basename(source));
    } catch (error) {
      throw new Error('Destination path is invalid');
    }
  } else {
    try {
      const destStat = await fs.stat(destination);

      if (destStat.isDirectory()) {
        destPath = path.join(destination, path.basename(source));
      } else {
        destPath = destination;
      }
    } catch (error) {
      destPath = destination;
    }
  }

  return destPath;
}

async function main() {
  const [source, destination] = process.argv.slice(2);

  if (!source || !destination) {
    console.error('Source and destination paths are required');

    return;
  }

  const absoluteSource = path.resolve(source);
  const absoluteDestination = path.resolve(destination);

  if (absoluteSource === absoluteDestination) {
    return;
  }

  try {
    await validateSource(absoluteSource);
  } catch (error) {
    console.error('Error validating source file: ' + error.message);

    return;
  }

  const destPath = await setDestPath(destination, absoluteSource);

  try {
    await fs.rename(absoluteSource, destPath);
  } catch (error) {
    console.error('Error moving file: ' + error.message);
  }
}

main();
