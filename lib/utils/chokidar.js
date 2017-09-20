"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function readyEvent(watcher) {
    return new Promise(resolve => {
        watcher.once('ready', resolve);
    });
}
exports.readyEvent = readyEvent;
//# sourceMappingURL=chokidar.js.map