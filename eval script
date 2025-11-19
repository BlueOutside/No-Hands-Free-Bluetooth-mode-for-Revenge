// This script should be ran using /eval in the discord app

(function() {
    try {
        const RN = vendetta.metro.common.ReactNative;
        const patcher = vendetta.patcher;
        const registry = RN.TurboModuleRegistry;

        const moduleName = "NativeAudioManagerModule";
        const functions = ["setCommunicationModeOn", "setActiveAudioDevice"];
        let count = 0;

        const newModule = registry.get(moduleName);
        if (newModule) {
            functions.forEach(func => {
                if (typeof newModule[func] === 'function') {
                    patcher.instead(func, newModule, () => {});
                    count++;
                }
            });
        }

        const oldModule = RN.NativeModules[moduleName];
        if (oldModule) {
            functions.forEach(func => {
                if (typeof oldModule[func] === 'function') {
                    patcher.instead(func, oldModule, () => {});
                    count++;
                }
            });
        }

        if (count > 0) {
            alert("Success: Bluetooth Audio Fix applied.");
        } else {
            alert("Error: Could not find Audio Module to patch.");
        }

    } catch (e) {
        alert("Error applying Bluetooth Fix: " + e.message);
    }
})();
