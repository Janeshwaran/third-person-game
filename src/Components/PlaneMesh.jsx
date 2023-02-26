import { useBox, useCompoundBody, usePlane } from '@react-three/cannon'
import { Box } from '@react-three/drei'
import React from 'react'

function PlaneMesh() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0]}))
  const [wall1] = useBox(() => ({args:[5,5,50],position:[-27.5,2.5,0]}))
  const [wall2] = useBox(() => ({args:[5,5,50],position:[27.5,2.5,0]}))
  const [wall3] = useBox(() => ({args:[5,5,50],position:[0,2.5,-27.5], rotation: [0,-Math.PI / 2, 0]}))
  const [wall4] = useBox(() => ({args:[5,5,50],position:[0,2.5,27.5], rotation: [0,-Math.PI / 2, 0]}))

    return (
      <>
      <Box ref={wall1}  visible={false}/>
      <Box ref={wall2}  visible={false}/>
      <Box ref={wall3}  visible={false}/>
      <Box ref={wall4}  visible={false}/>
        <mesh ref={ref} receiveShadow position={[0, -0.85, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="lightgreen" />
        </mesh>
        </>
    )
}

export default PlaneMesh
