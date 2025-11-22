import { patcher, metro } from "@vendetta";

// We need to store the cleanup functions returned by patcher to run them onUnload
let unpatches = [];

export default {
    onLoad: () => {
        try {
            const RN = metro.common.ReactNative;
            const registry = RN.TurboModuleRegistry;

            const moduleName = "NativeAudioManagerModule";
            const functions = ["setCommunicationModeOn", "setActiveAudioDevice"];

            // Helper function to apply patches to a specific module instance
            const applyPatch = (module) => {
                if (!module) return;
                
                functions.forEach(func => {
                    if (typeof module[func] === 'function') {
                        // patcher.instead returns a function that undoes the patch
                        // We push that function to our array to call later
                        unpatches.push(patcher.instead(func, module, () => {
                            // This empty arrow function replaces the original functionality,
                            // effectively disabling the audio switching.
                        }));
                    }
                });
            };

            // 1. Try TurboModuleRegistry (New Architecture)
            const newModule = registry.get(moduleName);
            applyPatch(newModule);

            // 2. Try NativeModules (Legacy Architecture)
            const oldModule = RN.NativeModules[moduleName];
            applyPatch(oldModule);

        } catch (e) {
            console.error("Bluetooth Audio Fix failed to load:", e);
        }
    },

    onUnload: () => {
        // Loop through all stored unpatch functions and call them
        unpatches.forEach(unpatch => unpatch());
        // Clear the array
        unpatches = [];
    }
}