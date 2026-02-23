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
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import glb from "./assets/personaje_fut_comp.glb";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
);

const Model = () => {
    const gltf = useLoader(GLTFLoader, glb, (loader) => {
        loader.setDRACOLoader(dracoLoader);
    }) as any;
    const mixer = new THREE.AnimationMixer(gltf.scene);

    if (gltf.animations && gltf.animations.length > 0) {
        mixer.clipAction(gltf.animations[0]).play();
    }

    useFrame((_, delta) => {
        mixer.update(delta);
    });

    return <primitive object={gltf.scene} position={[0, -1, 0]} scale={1.7} />;
};

function App() {
    const [placementMode, setPlacementMode] = useState(true);

    return (
        <>
            <BrowserCompatibility />
            <ZapparCanvas
                {...({
                    onCreated: (state: any) =>
                        glContextSet(state.gl.getContext()),
                } as any)}>
                <ZapparCamera permissionRequest />
                <InstantTracker
                    placementMode={placementMode}
                    placementCameraOffset={[0, 0, -5]}>
                    <Suspense fallback={null}>
                        <Model />
                    </Suspense>
                    <directionalLight position={[0, 3, 5]} intensity={3} />
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
