"use strict";

import * as fs from "fs";
import * as path from "path";
import { window, workspace, ViewColumn } from "vscode";

export function dirExists(dir: any) {
  const rootPath = workspace.rootPath;

  try {
    return fs.statSync(path.resolve(`${rootPath}/${dir}`)).isDirectory();
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
  }
}

export function openFile(fileName: string) {
  workspace
    .openTextDocument(fileName)
    .then((text_document) => {
      window.showTextDocument(text_document, ViewColumn.Two, true);
    });
}

export function prompt(msg: string, choices: any, cb: any) {
  const options = { placeHolder: msg };

  return window
    .showQuickPick(choices, options)
    .then((answer) => cb(answer));
}