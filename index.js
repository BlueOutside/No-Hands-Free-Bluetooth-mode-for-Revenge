(function (exports, metro, patcher) {
    "use strict";

    const { ReactNative: RN } = metro;
    const moduleName = "NativeAudioManagerModule";
    const functionsToPatch = ["setCommunicationModeOn", "setActiveAudioDevice"];
    let patches = [];

    // Logic to apply patches
    try {
        const registry = RN.TurboModuleRegistry;
        const newModule = registry.get(moduleName);
        const oldModule = RN.NativeModules[moduleName];

        const targets = [newModule, oldModule].filter(m => m !== null && m !== undefined);

        for (const target of targets) {
            for (const func of functionsToPatch) {
                if (typeof target[func] === "function") {
                    // Store the unpatcher function
                    patches.push(patcher.instead(func, target, () => {}));
                }
            }
        }
        console.log(`[Bluetooth Fix] Patched ${patches.length} functions.`);
    } catch (e) {
        console.error("[Bluetooth Fix] Error:", e);
    }

    // This handles cleaning up when you toggle the plugin off
    exports.onUnload = () => {
        patches.forEach(unpatch => unpatch());
    };

    return exports;
})({}, vendetta.metro.common, vendetta.patcher);
