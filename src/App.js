import { OrbitControls, PointerLockControls, Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import { Character } from "./Model/Character";
import { Debug, Physics } from "@react-three/cannon";
import { Plane } from "three";
import PlaneMesh from "./Components/PlaneMesh";

function App() {
  return (
    <div className="App">
      <Canvas shadows camera={{ fov: 45, position:[0,4,-9] }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.3} />
        <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
        <Physics gravity={[0, -30, 0]}>
        {/* <Debug color="black" scale={1.1}> */}
        <PlaneMesh/>
        <Character />
        {/* </Debug> */}
        </Physics>
        <OrbitControls />
        {/* <PointerLockControls/> */}
      </Canvas>
    </div>
  );
}

export default App;
