import { Suspense, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import {
    ZapparCamera,
    InstantTracker,
    ZapparCanvas,
    BrowserCompatibility,
} from "@zappar/zappar-react-three-fiber";
import { glContextSet } from "@zappar/zappar-threejs";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import glb from "./assets/waving.glb";

const Model = () => {
    const timer = new THREE.Timer();
    const gltf = useLoader(GLTFLoader, glb) as any;
    const mixer = new THREE.AnimationMixer(gltf.scene);
    mixer.clipAction(gltf.animations[0]).play();

    useFrame(() => { timer.update(); mixer.update(timer.getDelta()); });

    return <primitive object={gltf.scene} position={[0, -1, 0]} />;
};

function App() {
    const [placementMode, setPlacementMode] = useState(true);

    return (
        <>
            <BrowserCompatibility />
            <ZapparCanvas {...{ onCreated: (state: any) => glContextSet(state.gl.getContext()) } as any}>
                <ZapparCamera permissionRequest />
                <InstantTracker
                    placementMode={placementMode}
                    placementCameraOffset={[0, 0, -5]}>
                    <Suspense fallback={null}>
                        <Model />
                    </Suspense>
                    <directionalLight position={[2.5, 8, 5]} intensity={1.5} />
                </InstantTracker>
            </ZapparCanvas>
            <div
                id="zappar-placement-ui"
                onClick={() => setPlacementMode((cur) => !cur)}
                onKeyDown={() => setPlacementMode((cur) => !cur)}
                role="button"
                tabIndex={0}>
                Tap here to {placementMode ? "Place" : "Move"} the object
            </div>
        </>
    );
}

export default App;
