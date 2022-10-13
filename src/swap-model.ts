"use strict";

import * as fs from "fs";
import * as utils from "./utils";
import * as vscode from "vscode";

export default class SwapModel {
  private fileName: string;
  private msg: string;
  private options: any;
  private objLine: any;

  constructor(fileName: string) {
    this.fileName = fileName;
    this.msg = "Qual arquivo relativo você deseja abrir?";
    this.options = ["assets", "controller",  "helper", "model", "view", "viewModel"];
    this.objLine = {
      model: {
        prefix: "/app/models",
        suffix: ".rb"
      },
      viewModel: {
        prefix: "/app/components/view_model",
        suffix: ".rb"
      },
      controller: {
        prefix: "/app/controllers",
        suffix: "s_controller.rb"
      },
      spec: {
        prefix: "/spec",
        suffix: "_spec.rb"
      },
      helper: {
        prefix: "/app/helpers",
        suffix: "s_helper.rb"
      },
      view: {
        prefix: "/app/views",
        suffix: "s/index.html.slim"
      },
      assets: {
        prefix: "/app/assets/javascripts/classes",
        suffix: "s/index.coffee",
        suffix2: "s/index.coffee.erb"
      }
    };
  }

  decideFileToOpen(file: string) {
    const current = this.currentPathType();
    const filePath = this.cleanFileName(this.objLine[current].prefix, this.objLine[current].suffix, current);
    const fileName = this.mountFileName(filePath, this.objLine[file].prefix, this.objLine[file].suffix, file);

    if (this.relatedPathExists(fileName)) {
      utils.openFile(this.mountFileName(fileName, this.objLine[file].prefix, this.objLine[file].suffix, file));
    } else {
      if (file === 'assets') {
        if (this.relatedPathExists(this.mountFileName(filePath, this.objLine[file].prefix, this.objLine[file].suffix2, file))) {
          utils.openFile(this.mountFileName(fileName, this.objLine[file].prefix, this.objLine[file].suffix2, file));
        } else {
          vscode.window.showInformationMessage("Arquivos não encontrados: " + fileName + " e " + this.mountFileName(filePath, this.objLine[file].prefix, this.objLine[file].suffix2, file));
        }
      } else {
        vscode.window.showErrorMessage("Arquivo não encontrado: " + fileName);
      }
    }
  }

  destinationPath() {
    return utils.prompt(this.msg, this.options, (answer: string) => {
      this.decideFileToOpen(answer);
    });
  }

  private relatedPathExists(path: string) {
    return fs.existsSync(path);
  }

  private currentPathType() {
    if (this.isModel()) { return "model"; }
    if (this.isViewModel()) { return "viewModel"; }
    if (this.isController()) { return "controller"; }
    if (this.isSpec()) { return "spec"; }
    if (this.isHelper()) { return "helper"; }
    if (this.isView()) { return "view"; }
    if (this.isAssets()) { return "assets"; }

    return "";
  }

  private isModel() {
    return this.fileName.match(/\/app\/models\//);
  }

  private isViewModel() {
    return this.fileName.match(/\/components\/view_model\//);
  }

  private isController() {
    return this.fileName.match(/\/app\/controllers\//);
  }

  private isSpec() {
    return this.fileName.match(/\/spec\//);
  }

  private isHelper() {
    return this.fileName.match(/\/app\/helpers\//);
  }

  private isView() {
    return this.fileName.match(/\/app\/views\//);
  }

  private isAssets() {
    return this.fileName.match(/assets/);
  }

  private cleanFileName(prefix: string, suffix: string, key: string) {
    if (key === "assets") {
      return this.fileName.replace(prefix, "444").replace(suffix, "555").replace(".erb", "");
    } else {
      return this.fileName.replace(prefix, "444").replace(suffix, "555");
    }
  }

  private mountFileName(fileName: string, prefix: string, suffix: string, key: string) {
    if (key === "assets" || key === "view") { return fileName.replace("444", prefix).replace("555", suffix); }
    if (fileName.replace("555", '')[fileName.replace("555", '').length -1] === 's') {
      return fileName.replace("444", prefix).replace("555", '').slice(0, -1) + suffix;
    } else {
      return fileName.replace("444", prefix).replace("555", suffix);
    }
  }
}