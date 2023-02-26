import { Box, OrbitControls, Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import { Character } from "./Components/Character";
import { Debug, Physics } from "@react-three/cannon";
import PlaneMesh from "./Components/PlaneMesh";
import EnvAssets from "./Components/EnvAssets";

function App() {
  return (
    <div className="App">
      <Canvas shadows camera={{ fov: 45, position:[0,2,-5] }}>
        <Sky sunPosition={[-100, 20, -100]} />
        <ambientLight intensity={0.3} />
        <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
        <Physics gravity={[0, -30, 0]}>
        <Debug color="black" scale={1}>
        <PlaneMesh/>
        <Character  />
        <EnvAssets/>
        </Debug>
        </Physics>
      
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
