import { usePlane } from '@react-three/cannon'
import React from 'react'

function PlaneMesh() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0]}))

    return (
        <mesh ref={ref} receiveShadow position={[0, -0.85, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="lightgreen" />
        </mesh>
    )
}

export default PlaneMesh
