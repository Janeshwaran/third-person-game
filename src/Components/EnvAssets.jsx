import { useBox } from "@react-three/cannon";
import { Box } from "@react-three/drei";
import React from "react";

function Boxes(props) {
  const [ref] = useBox(() => ({ mass:40,...props}))

  return (
    <>
      <Box ref={ref} {...props} />
     
    </>
  );
}

function EnvAssets() {
    return(
        <>
        <Boxes position={[0, 0.5, 7]} args={[1.5,1.5,1.5]}/>
        <Boxes position={[7, 0.5, 0]} args={[1.5,1.5,1.5]}/>
        <Boxes position={[7, 0.5, -7]} args={[1.5,1.5,1.5]}/>
        <Boxes position={[7, 0.5, 7]} args={[1.5,1.5,1.5]}/>
        <Boxes position={[-8, 0.5, 1]} args={[1.5,1.5,1.5]}/>
        <Boxes position={[6, 0.5, 7]} args={[1.5,1.5,1.5]}/>
        <Boxes position={[5, 0.5, 2]} args={[1.5,1.5,1.5]}/>
        </>
    )
}
export default EnvAssets;
