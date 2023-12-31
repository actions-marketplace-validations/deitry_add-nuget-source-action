"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const uuid_1 = require("uuid");
const dotnet_1 = require("./dotnet");
const child_process_1 = require("child_process");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // core.setOutput('time', new Date().toTimeString())
            const url = core.getInput('url');
            if (!url)
                throw new Error('url input parameter is required');
            const username = core.getInput('username');
            const pwd = core.getInput('password');
            const packageSourceList = (0, dotnet_1.getPackageSourceList)();
            const sourceAdded = packageSourceList.some(element => element.url === url);
            if (sourceAdded) {
                core.info(`Source ${url} already exists`);
                return;
            }
            const packageSourceName = (0, uuid_1.v4)();
            if (username) {
                // private package source
                const command = [
                    'dotnet nuget add source',
                    `"${url}"`,
                    `--name "${packageSourceName}"`,
                    `--username ${username}`,
                    `--password ${pwd}`,
                    // --store-password-in-clear-text is mandatory for non-Windows machines
                    '--store-password-in-clear-text'
                ].join(' ');
                core.info(`Adding source: ${command}`);
                (0, child_process_1.execSync)(command, { stdio: 'inherit' });
            }
            else {
                // public package source
                const command = [
                    'dotnet nuget add source',
                    `"${url}"`,
                    `--name "${packageSourceName}"`
                ].join(' ');
                core.info(`Adding source: ${command}`);
                (0, child_process_1.execSync)(command, { stdio: 'inherit' });
            }
            core.saveState('needCleanup', true);
        }
        catch (error) {
            if (error instanceof Error) {
                core.setFailed(error.message);
                if (error.stack)
                    core.debug(error.stack);
            }
        }
    });
}
run();
