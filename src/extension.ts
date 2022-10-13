"use strict";

import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import SwapModel from "./swap-model";

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand("swapmodel.Swap", () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { return; }
		const swapmodel = new SwapModel(editor.document.fileName);
		swapmodel.destinationPath();
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }