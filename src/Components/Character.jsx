import React, { useEffect, useRef } from "react";
import {
  useGLTF,
  useAnimations,
  PerspectiveCamera,
} from "@react-three/drei";
import CharacterModel from "../Model/Character.gltf";
import { useSphere } from "@react-three/cannon";
import { useThree, useFrame } from "@react-three/fiber";
import { useKeyboardInput } from "../useKeyboardInput";
import * as THREE from "three";

export function Character(props) {
  const { camera } = useThree();
  const controlsRef = useRef();
  const camRef = useRef();
  const container = useRef();
  let currAction = useRef("");

  const xAxis = new THREE.Vector3(1, 0, 0);
  const tempCameraVector = new THREE.Vector3();
  const tempModelVector = new THREE.Vector3();
  const cameraOrigin = new THREE.Vector3(0, 1.5, 0);

  const [group, api] = useSphere(() => ({
    mass: 1,
    args:[0.5,0.5,0.5],
    position: [0, 2, 0],
    type: "Dynamic",
    // fixedRotation: "true",
    angularDamping: 1,
    ...props,
  }));
  const { nodes, materials, animations } = useGLTF(CharacterModel);
  const { actions } = useAnimations(animations, group);
  const velocity = useRef([0, 0, 0]);

  function rotate() {
    camera.getWorldDirection(tempCameraVector);
    const cameraDirection = tempCameraVector.setY(0).normalize();

    container.current.getWorldDirection(tempModelVector);
    const playerDirection = tempModelVector.setY(0).normalize();

    const cameraAngle =
      cameraDirection.angleTo(xAxis) * (cameraDirection.z > 0 ? 1 : -1);
    const playerAngle =
      playerDirection.angleTo(xAxis) * (playerDirection.z > 0 ? 1 : -1);

    const angleToRotate = playerAngle - cameraAngle;

    api.rotation.set(0, angleToRotate, 0);
  }

  const { moveForward, moveBackward, moveLeft, moveRight, run } =
    useKeyboardInput();

  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v));
  }, [api.velocity]);

  useEffect(() => {
    let newAction = "";
    if (moveForward || moveBackward || moveLeft || moveRight) {
      newAction = "Walking";
      if (run && moveForward) {
        newAction = "Running";
      }
    } else {
      newAction = "Idle";
    }

    if (currAction.current != newAction) {
      const nextAction = actions[newAction];
      const current = actions[currAction.current];
      current?.fadeOut(0.2);
      nextAction?.reset().fadeIn(0.2).play();
      currAction.current = newAction;
    }
    container.current.position.y =-0.5;
  }, [moveForward, moveBackward, moveLeft, moveRight, run]);

  useFrame((state, delta) => {
    let speed = 7;
    let pos = group.current.getWorldPosition(new THREE.Vector3()).clone();
    camRef.current.position.copy(new THREE.Vector3(pos.x, pos.y, pos.z + 1.38));
    camera.lookAt(new THREE.Vector3(pos.x, pos.y+1, pos.z));

    rotate();

    if (moveLeft || moveRight || moveBackward) {
      speed = 2;
    }
    const direction = new THREE.Vector3();

    const frontVector = new THREE.Vector3(
      0,
      0,
      Number(moveBackward) - Number(moveForward)
    );
    const sideVector = new THREE.Vector3(
      Number(moveLeft) - Number(moveRight),
      0,
      0
    );
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(run && moveForward ? 12 : speed)
      .applyEuler(camera.rotation);

    api.velocity.set(direction.x, velocity.current[1], direction.z);
  });

  return (
    <>
      <group position={[0, -1, -2]} name="Scene" ref={camRef}>
        <PerspectiveCamera fov={45} position={[0, 2, -5]} makeDefault={true} />
      </group>
      <group ref={container}>
        <group name="model" ref={group} dispose={null}>
          <group name="Armature" position={[0, -0.00418633, 0.01643145]}>
            <primitive object={nodes.mixamorigHips} />
            <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
              <group name="root">
                <group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
                  <group name="Mixamo_rig_184">
                    <group name="GLTF_created_0">
                      <group name="23_JERSEY_178" />
                      <group name="23_SHORTS_179" />
                      <group name="ANIME_HAIR_180" />
                      <group name="DARK_181" />
                      <group name="FORCE_23_182" />
                      <group name="GLTF_created_0_rootJoint">
                        <group
                          name="Ctrl_ArmPole_IK_Left_139"
                          position={[0.26838592, 0.94228381, -0.34265286]}
                          rotation={[-Math.PI / 2, 0, 0]}
                        />
                        <group
                          name="Ctrl_ArmPole_IK_Right_141"
                          position={[-0.18428583, 0.92402673, -0.3332037]}
                          rotation={[-Math.PI / 2, 0, 0]}
                        />
                        <group
                          name="Ctrl_Foot_IK_Left_158"
                          position={[0.13340273, 0.20125347, -0.05665205]}
                          rotation={[-1.44098381, -0.03508386, -2.65482046]}
                        >
                          <group
                            name="Ctrl_FootRoll_Cursor_Left_157"
                            position={[0, -0.10131433, 0]}
                          />
                          <group
                            name="Foot_IK_Left_147"
                            position={[0, 0, -0.00000769]}
                            rotation={[-0.57007367, 0.19458408, -0.00069802]}
                          >
                            <group
                              name="Foot_Snap_Left_143"
                              rotation={[0.58772133, -0.16288843, 0.10763055]}
                            />
                            <group
                              name="ToeTrack_Left_146"
                              position={[0, 0.10086445, 0]}
                              rotation={[0.59242539, -0.00676713, 0.00455221]}
                            >
                              <group
                                name="Toe01_IK_Left_145"
                                position={[0, -0.00000336, 0.00000224]}
                                rotation={[-0.01160193, -0.07149802, 0.0467563]}
                              >
                                <group
                                  name="Toe02_Left_144"
                                  position={[0, 0.02160656, 0]}
                                />
                              </group>
                            </group>
                          </group>
                          <group
                            name="FootHeelOut_Left_156"
                            position={[-0.02968594, 0.00320753, -0.05027847]}
                            rotation={[0, 0.16382021, 0]}
                          >
                            <group
                              name="FootHeelIn_Left_155"
                              position={[0.0601778, -0.00641505, 0]}
                            >
                              <group
                                name="FootHeelMid_Left_154"
                                position={[-0.03008898, 0.00320757, 0]}
                              >
                                <group
                                  name="ToeEnd_Left_153"
                                  position={[
                                    0.00438375, 0.12740801, 0.00095959,
                                  ]}
                                  rotation={[
                                    0.02104763, -0.00905872, -0.10162545,
                                  ]}
                                >
                                  <group
                                    name="Ctrl_Foot_01_Left_151"
                                    position={[0, -0.04321311, 0]}
                                    rotation={[-0.59240898, 0.00815583, -2e-7]}
                                  >
                                    <group
                                      name="Foot_01_Pole_Left_150"
                                      position={[0, 0, 0.201729]}
                                      rotation={[
                                        Math.PI / 2,
                                        -0.0748874,
                                        -3e-8,
                                      ]}
                                    />
                                    <group
                                      name="Foot_IK_target_Left_149"
                                      position={[0, -0.10086446, 0]}
                                      rotation={[-3e-8, -0.19497442, Math.PI]}
                                    />
                                  </group>
                                  <group
                                    name="Ctrl_Toe_IK_Left_152"
                                    position={[0, -0.04321314, 0]}
                                    rotation={[
                                      -0.01154989, -0.07149804, 0.04675628,
                                    ]}
                                  />
                                  <group name="ToeEnd_01_Left_148" />
                                </group>
                              </group>
                            </group>
                          </group>
                        </group>
                        <group
                          name="Ctrl_Foot_IK_Right_175"
                          position={[-0.17773935, 0.20452768, -0.05693839]}
                          rotation={[-1.5933892, -0.06394633, 2.69406983]}
                        >
                          <group
                            name="Ctrl_FootRoll_Cursor_Right_174"
                            position={[0, -0.10126084, 0]}
                          />
                          <group
                            name="Foot_IK_Right_164"
                            position={[0, 0, -0.00000377]}
                            rotation={[-0.57032334, -0.19518156, 0.00070087]}
                          >
                            <group
                              name="Foot_Snap_Right_160"
                              rotation={[0.5880499, 0.1633596, -0.10801266]}
                            />
                            <group
                              name="ToeTrack_Right_163"
                              position={[0, 0.10082906, 0]}
                              rotation={[0.59298661, 0.00301565, -0.00202689]}
                            >
                              <group
                                name="Toe01_IK_Right_162"
                                rotation={[
                                  -0.02645693, 0.07520239, -0.04764241,
                                ]}
                              >
                                <group
                                  name="Toe02_Right_161"
                                  position={[0, 0.02207563, 0]}
                                />
                              </group>
                            </group>
                          </group>
                          <group
                            name="FootHeelOut_Right_173"
                            position={[0.029672, 0.00321747, -0.05026968]}
                            rotation={[0, -0.16429972, 0]}
                          >
                            <group
                              name="FootHeelIn_Right_172"
                              position={[-0.06015436, -0.00643495, 0]}
                            >
                              <group
                                name="FootHeelMid_Right_171"
                                position={[0.0300771, 0.00321746, 0]}
                              >
                                <group
                                  name="ToeEnd_Right_170"
                                  position={[
                                    -0.00460598, 0.12828304, 0.00099642,
                                  ]}
                                  rotation={[
                                    0.02196849, 0.00538672, 0.10451674,
                                  ]}
                                >
                                  <group
                                    name="Ctrl_Foot_01_Right_168"
                                    position={[0, -0.04415125, 0]}
                                    rotation={[
                                      -0.59298737, -0.00363424, -0.00000416,
                                    ]}
                                  >
                                    <group
                                      name="Foot_01_Pole_Right_167"
                                      position={[0, 0, 0.20165804]}
                                      rotation={[
                                        Math.PI / 2,
                                        0.07403464,
                                        -6.9e-7,
                                      ]}
                                    />
                                    <group
                                      name="Foot_IK_target_Right_166"
                                      position={[0, -0.10082907, 0]}
                                      rotation={[0, 0.19557483, Math.PI]}
                                    />
                                  </group>
                                  <group
                                    name="Ctrl_Toe_IK_Right_169"
                                    position={[0, -0.04415124, 0]}
                                    rotation={[
                                      -0.02643126, 0.07520228, -0.047642,
                                    ]}
                                  />
                                  <group name="ToeEnd_01_Right_165" />
                                </group>
                              </group>
                            </group>
                          </group>
                        </group>
                        <group
                          name="Ctrl_Hand_IK_Left_140"
                          position={[0.29562327, 0.7423445, -0.04665766]}
                          rotation={[2.31430325, -1.22372862, -0.7620395]}
                          scale={[0.75077808, 0.75077826, 0.75077748]}
                        />
                        <group
                          name="Ctrl_Hand_IK_Right_142"
                          position={[-0.29212174, 0.76027489, -0.03126952]}
                          rotation={[2.34675643, 1.21542284, 0.60227098]}
                        />
                        <group
                          name="Ctrl_LegPole_IK_Left_159"
                          position={[0.18976407, 0.43147638, 0.27319664]}
                          rotation={[-Math.PI / 2, 0, 0]}
                        />
                        <group
                          name="Ctrl_LegPole_IK_Right_176"
                          position={[-0.19440578, 0.42939773, 0.26748258]}
                          rotation={[-Math.PI / 2, 0, 0]}
                        />
                        <group name="Ctrl_Master_138" rotation={[0, 0.01, 0]}>
                          <group
                            name="Ctrl_Hips_137"
                            position={[-0.00154604, 0.81432766, -0.00397054]}
                            rotation={[-0.01564834, 0.07315612, -0.02072931]}
                          >
                            <group
                              name="Ctrl_Hips_Free_119"
                              position={[0, 0.10436995, 0]}
                              rotation={[-Math.PI, 0, 0]}
                            >
                              <group
                                name="Ctrl_UpLeg_FK_Left_111"
                                position={[0.10164325, 0.15266207, 0.001012]}
                                rotation={[
                                  -3.05649103, 0.01299885, -2.99033141,
                                ]}
                              >
                                <group
                                  name="Ctrl_Leg_FK_Left_110"
                                  position={[0, 0.31438607, 0]}
                                  rotation={[-0.02121319, 0.00000405, 4e-8]}
                                >
                                  <group
                                    name="Ctrl_Foot_FK_Left_109"
                                    position={[0, 0.26168555, 0]}
                                    rotation={[
                                      1.65909488, -0.15307422, 0.23224105,
                                    ]}
                                  >
                                    <group
                                      name="Foot_FK_Left_108"
                                      rotation={[
                                        -0.57014164, 0.19458488, -0.00068719,
                                      ]}
                                    >
                                      <group
                                        name="Ctrl_Toe_FK_Left_107"
                                        position={[0, 0.10086446, 0]}
                                        rotation={[
                                          0.5924398, -0.00676802, 0.0045541,
                                        ]}
                                      />
                                    </group>
                                  </group>
                                </group>
                              </group>
                              <group
                                name="Ctrl_UpLeg_FK_Right_118"
                                position={[-0.10164326, 0.15266201, 0.00073348]}
                                rotation={[
                                  -3.05636282, -0.01308963, 2.99033808,
                                ]}
                              >
                                <group
                                  name="Ctrl_Leg_FK_Right_117"
                                  position={[0, 0.31438786, 0]}
                                  rotation={[-0.02506787, 0, 0]}
                                >
                                  <group
                                    name="Ctrl_Foot_FK_Right_116"
                                    position={[0, 0.26179656, 0]}
                                    rotation={[
                                      1.66297188, 0.15308674, -0.23235142,
                                    ]}
                                  >
                                    <group
                                      name="Foot_FK_Right_115"
                                      rotation={[
                                        -0.57035643, -0.19518231, 0.00069393,
                                      ]}
                                    >
                                      <group
                                        name="Ctrl_Toe_FK_Right_114"
                                        position={[0, 0.10082904, 0]}
                                        rotation={[
                                          0.59299352, 0.00301913, -0.00202717,
                                        ]}
                                      />
                                    </group>
                                  </group>
                                </group>
                              </group>
                              <group
                                name="Hips_Free_Helper_104"
                                position={[0, 0.10436992, 0]}
                                rotation={[-Math.PI, 0, 0]}
                              />
                              <group
                                name="UpLeg_IK_Left_106"
                                position={[0.10164325, 0.15266207, 0.001012]}
                                rotation={[-2.5795857, 1.33752681, 1.31210642]}
                              >
                                <group
                                  name="Leg_IK_Left_105"
                                  position={[0, 0.31438616, 0]}
                                  rotation={[-0.38781877, 0, 0]}
                                />
                              </group>
                              <group
                                name="UpLeg_IK_Right_113"
                                position={[-0.10164326, 0.15266207, 0.00073349]}
                                rotation={[
                                  2.82401725, -1.01272926, -2.36038639,
                                ]}
                              >
                                <group
                                  name="Leg_IK_Right_112"
                                  position={[0, 0.31438792, 0]}
                                  rotation={[-0.2456642, 0, 0]}
                                />
                              </group>
                            </group>
                            <group
                              name="Ctrl_Spine_136"
                              position={[0, 0.08703579, -0.01324999]}
                              rotation={[-0.1254967, 0.00047599, -0.03123215]}
                            >
                              <group
                                name="Ctrl_Spine1_135"
                                position={[0, 0.10271145, 0]}
                                rotation={[
                                  -0.06704895, 0.00136433, -0.00157327,
                                ]}
                              >
                                <group
                                  name="Ctrl_Spine2_134"
                                  position={[0, 0.11738491, 0]}
                                  rotation={[
                                    -0.06704598, 0.00180747, -0.00152478,
                                  ]}
                                >
                                  <group
                                    name="Ctrl_Arm_FK_Left_127"
                                    position={[
                                      0.13990949, 0.08272628, -0.01497879,
                                    ]}
                                    rotation={[
                                      1.60331789, -0.78621798, -1.53226207,
                                    ]}
                                  >
                                    <group
                                      name="Ctrl_ForeArm_FK_Left_126"
                                      position={[
                                        0.00027106, 0.23369373, -0.00066364,
                                      ]}
                                      rotation={[
                                        0.00272208, 0.00089112, 0.19454117,
                                      ]}
                                    >
                                      <group
                                        name="Ctrl_Hand_FK_Left_125"
                                        position={[0, 0.24076523, 0]}
                                        rotation={[
                                          -0.01396805, -0.07749211, -0.05990743,
                                        ]}
                                      />
                                    </group>
                                  </group>
                                  <group
                                    name="Ctrl_Arm_FK_Right_133"
                                    position={[
                                      -0.13843428, 0.07918115, -0.01636045,
                                    ]}
                                    rotation={[
                                      1.60248771, 0.78571658, 1.53328296,
                                    ]}
                                  >
                                    <group
                                      name="Ctrl_ForeArm_FK_Right_132"
                                      position={[0, 0.2207793, 0]}
                                      rotation={[
                                        0.00795653, -0.00230641, -0.18544734,
                                      ]}
                                    >
                                      <group
                                        name="Ctrl_Hand_FK_Right_131"
                                        position={[0, 0.25477234, 0]}
                                        rotation={[
                                          -0.05511412, 0.05713016, 0.07088855,
                                        ]}
                                      />
                                    </group>
                                  </group>
                                  <group
                                    name="Ctrl_Neck_121"
                                    position={[0, 0.13205813, 0]}
                                    rotation={[
                                      0.09724758, -0.00515051, -0.00762547,
                                    ]}
                                  >
                                    <group
                                      name="Ctrl_Head_120"
                                      position={[
                                        -0.0036543, 0.07827691, 0.02877297,
                                      ]}
                                      rotation={[
                                        -0.15060079, -0.08784888, -0.1637683,
                                      ]}
                                    />
                                  </group>
                                  <group
                                    name="Ctrl_Shoulder_Left_124"
                                    position={[
                                      0.04651821, 0.11410858, -0.00281785,
                                    ]}
                                    rotation={[
                                      1.52924002, -0.29384585, -1.67732196,
                                    ]}
                                  >
                                    <group
                                      name="Arm_IK_Left_123"
                                      position={[0, 0.09927052, 0]}
                                      rotation={[
                                        0.83693232, 0.38606042, 0.00449258,
                                      ]}
                                    >
                                      <group
                                        name="ForeArm_IK_Left_122"
                                        position={[0, 0.22079042, 0]}
                                        rotation={[0, 0, 0.00471075]}
                                      />
                                    </group>
                                  </group>
                                  <group
                                    name="Ctrl_Shoulder_Right_130"
                                    position={[
                                      -0.04651818, 0.11408342, -0.00265098,
                                    ]}
                                    rotation={[
                                      1.51624875, 0.33824022, 1.70639491,
                                    ]}
                                  >
                                    <group
                                      name="Arm_IK_Right_129"
                                      position={[0, 0.09927048, 0]}
                                      rotation={[
                                        0.8796509, 0.03869267, 0.09338326,
                                      ]}
                                    >
                                      <group
                                        name="ForeArm_IK_Right_128"
                                        position={[0, 0.22077936, 0]}
                                        rotation={[
                                          -1e-8, -0.0000045, -0.00466849,
                                        ]}
                                      />
                                    </group>
                                  </group>
                                </group>
                              </group>
                            </group>
                          </group>
                        </group>
                        <group
                          name="mixamorigHips_103"
                          position={[-0.00158567, 0.8143276, -0.00395488]}
                          rotation={[-0.01555102, 0.08315305, -0.0205686]}
                        >
                          <group
                            name="mixamorigLeftUpLeg_97"
                            position={[0.10164327, -0.04829215, -0.00101203]}
                            rotation={[0.56199736, 1.33752715, 1.31211657]}
                          >
                            <group
                              name="mixamorigLeftLeg_96"
                              position={[0, 0.3143861, 0]}
                              rotation={[-0.38781886, 0, 0]}
                            >
                              <group
                                name="mixamorigLeftFoot_95"
                                position={[0, 0.26168549, 0]}
                                rotation={[1.20325109, -0.0370178, 0.14418788]}
                              >
                                <group
                                  name="mixamorigLeftToeBase_94"
                                  position={[0, 0.10086452, 0]}
                                  rotation={[
                                    0.57945229, -0.0783844, 0.05120078,
                                  ]}
                                >
                                  <group
                                    name="mixamorigLeftToe_End_93"
                                    position={[0, 0.04321315, 0]}
                                  />
                                </group>
                              </group>
                            </group>
                          </group>
                          <group
                            name="mixamorigRightUpLeg_102"
                            position={[-0.10164328, -0.04829222, -0.00073348]}
                            rotation={[-0.31757507, -1.0127299, -2.36038565]}
                          >
                            <group
                              name="mixamorigRightLeg_101"
                              position={[0, 0.31438786, 0]}
                              rotation={[-0.24566423, 0, 0]}
                            >
                              <group
                                name="mixamorigRightFoot_100"
                                position={[0, 0.26179662, 0]}
                                rotation={[1.13128596, 0.08210636, -0.1565425]}
                              >
                                <group
                                  name="mixamorigRightToeBase_99"
                                  position={[0, 0.1008287, 0]}
                                  rotation={[
                                    0.56483872, 0.07834154, -0.04955284,
                                  ]}
                                >
                                  <group
                                    name="mixamorigRightToe_End_98"
                                    position={[0, 0.04415105, 0]}
                                    rotation={[0, -0.0000059, 0]}
                                  />
                                </group>
                              </group>
                            </group>
                          </group>
                          <group
                            name="mixamorigSpine_92"
                            position={[0, 0.08703585, -0.01324999]}
                            rotation={[-0.12549672, 0.00047599, -0.03123215]}
                          >
                            <group
                              name="mixamorigSpine1_91"
                              position={[0, 0.10271163, 0]}
                              rotation={[-0.06704894, 0.00136436, -0.00157327]}
                            >
                              <group
                                name="mixamorigSpine2_87"
                                position={[0, 0.11738479, 0]}
                                rotation={[
                                  -0.06704592, 0.00180747, -0.00152477,
                                ]}
                              >
                                <group
                                  name="LowWing_L_83"
                                  position={[
                                    0.10524787, 0.02990903, -0.14694479,
                                  ]}
                                  rotation={[
                                    -0.61788734, -0.31193975, -0.82503976,
                                  ]}
                                >
                                  <group
                                    name="Midwing_L_82"
                                    position={[0, 0.20864311, 0]}
                                    rotation={[
                                      -0.66160172, -0.19755339, -0.55600412,
                                    ]}
                                  >
                                    <group
                                      name="Topwing_L_81"
                                      position={[0, 0.19366136, 0]}
                                      rotation={[
                                        0.3378934, 0.40889536, 0.61490025,
                                      ]}
                                    />
                                  </group>
                                </group>
                                <group
                                  name="LowWing_R_86"
                                  position={[
                                    -0.10747805, 0.02990903, -0.14694488,
                                  ]}
                                  rotation={[
                                    -0.59319443, 0.2970016, 0.81816325,
                                  ]}
                                >
                                  <group
                                    name="Midwing_R_85"
                                    position={[0, 0.20864308, 0]}
                                    rotation={[
                                      -0.70678227, 0.27185254, 0.58129846,
                                    ]}
                                  >
                                    <group
                                      name="Topwing_R_84"
                                      position={[0, 0.19366147, 0]}
                                      rotation={[
                                        0.35293151, -0.44530578, -0.58491964,
                                      ]}
                                    />
                                  </group>
                                </group>
                                <group
                                  name="mixamorigLeftShoulder_41"
                                  position={[
                                    0.04651817, 0.11410863, -0.00281785,
                                  ]}
                                  rotation={[
                                    1.52923982, -0.29384577, -1.67732191,
                                  ]}
                                >
                                  <group
                                    name="mixamorigLeftArm_40"
                                    position={[0, 0.09927063, 0]}
                                    rotation={[
                                      0.83693231, 0.38606039, 0.0044926,
                                    ]}
                                  >
                                    <group
                                      name="mixamorigLeftForeArm_39"
                                      position={[0, 0.22079034, 0]}
                                      rotation={[0, 0, 0.00471079]}
                                    >
                                      <group
                                        name="mixamorigLeftHand_38"
                                        position={[0, 0.25330898, 0]}
                                        rotation={[
                                          0.04025937, 0.0594459, 0.04696595,
                                        ]}
                                      >
                                        <group
                                          name="Ctrl_Index1_Left_28"
                                          position={[
                                            -0.02697108, 0.07446566, 0.00181301,
                                          ]}
                                          rotation={[
                                            0.33589155, -0.00510075, 0.1133246,
                                          ]}
                                        >
                                          <group
                                            name="Ctrl_Index2_Left_27"
                                            position={[
                                              -0.00007268, 0.02187406, 0,
                                            ]}
                                            rotation={[
                                              0.56391782, -0.01545517,
                                              -0.0533253,
                                            ]}
                                          >
                                            <group
                                              name="Ctrl_Index3_Left_26"
                                              position={[
                                                0.00000578, 0.02058776, 0,
                                              ]}
                                              rotation={[
                                                0.33473041, -0.00553903,
                                                -0.03278305,
                                              ]}
                                            />
                                          </group>
                                        </group>
                                        <group
                                          name="Ctrl_Middle1_Left_31"
                                          position={[
                                            -0.00805578, 0.0718711, -0.000974,
                                          ]}
                                          rotation={[
                                            0.34341384, 0.00744536, 0.00214556,
                                          ]}
                                        >
                                          <group
                                            name="Ctrl_Middle2_Left_30"
                                            position={[
                                              -0.00002669, 0.02550879, 0,
                                            ]}
                                            rotation={[
                                              0.52756136, -0.0140089,
                                              -0.05184259,
                                            ]}
                                          >
                                            <group
                                              name="Ctrl_Middle3_Left_29"
                                              position={[
                                                0.00000415, 0.02535939, 0,
                                              ]}
                                              rotation={[
                                                0.44635036, -0.01009176,
                                                -0.04445881,
                                              ]}
                                            />
                                          </group>
                                        </group>
                                        <group
                                          name="Ctrl_Pinky1_Left_37"
                                          position={[
                                            0.0249527, 0.06025467, 0.00259503,
                                          ]}
                                          rotation={[
                                            0.49594576, -0.13306935,
                                            -0.05865397,
                                          ]}
                                        >
                                          <group
                                            name="Ctrl_Pinky2_Left_36"
                                            position={[
                                              -0.00003659, 0.01868013, 0,
                                            ]}
                                            rotation={[
                                              0.57107924, -0.01550328,
                                              -0.05278283,
                                            ]}
                                          >
                                            <group
                                              name="Ctrl_Pinky3_Left_35"
                                              position={[0, 0.01725602, 0]}
                                              rotation={[
                                                0.47133247, -0.01065015,
                                                -0.04434507,
                                              ]}
                                            />
                                          </group>
                                        </group>
                                        <group
                                          name="Ctrl_Ring1_Left_34"
                                          position={[
                                            0.00923293, 0.06926809, -0.00015922,
                                          ]}
                                          rotation={[
                                            0.4783155, 0.02002333, -0.07072023,
                                          ]}
                                        >
                                          <group
                                            name="Ctrl_Ring2_Left_33"
                                            position={[
                                              -0.00002312, 0.02327194, 0,
                                            ]}
                                            rotation={[
                                              0.59282053, -0.01657371,
                                              -0.05423661,
                                            ]}
                                          >
                                            <group
                                              name="Ctrl_Ring3_Left_32"
                                              position={[
                                                0.00004593, 0.02245514, 0,
                                              ]}
                                              rotation={[
                                                0.62160702, -0.01816878,
                                                -0.05652952,
                                              ]}
                                            />
                                          </group>
                                        </group>
                                        <group
                                          name="Ctrl_Thumb1_Left_25"
                                          position={[
                                            -0.02072162, -0.00034548,
                                            0.00954037,
                                          ]}
                                          rotation={[
                                            -0.02091432, 0.13279798, 0.57814159,
                                          ]}
                                        >
                                          <group
                                            name="Ctrl_Thumb2_Left_24"
                                            position={[
                                              -0.00179374, 0.03902276, 0,
                                            ]}
                                            rotation={[
                                              0.32385962, -0.01575719,
                                              -0.22141078,
                                            ]}
                                          >
                                            <group
                                              name="Ctrl_Thumb3_Left_23"
                                              position={[
                                                -0.00154372, 0.02977278, 0,
                                              ]}
                                              rotation={[
                                                -0.44420282, -0.12647188,
                                                0.22108485,
                                              ]}
                                            />
                                          </group>
                                        </group>
                                        <group
                                          name="mixamorigLeftHandIndex1_10"
                                          position={[
                                            -0.02697108, 0.07446566, 0.00181301,
                                          ]}
                                          rotation={[
                                            0.33589155, -0.00510075, 0.1133246,
                                          ]}
                                        >
                                          <group
                                            name="mixamorigLeftHandIndex2_9"
                                            position={[
                                              -0.00007268, 0.02187406, 0,
                                            ]}
                                            rotation={[
                                              0.56391782, -0.01545517,
                                              -0.0533253,
                                            ]}
                                          >
                                            <group
                                              name="mixamorigLeftHandIndex3_8"
                                              position={[
                                                0.00000578, 0.02058776, 0,
                                              ]}
                                              rotation={[
                                                0.33473041, -0.00553903,
                                                -0.03278305,
                                              ]}
                                            >
                                              <group
                                                name="mixamorigLeftHandIndex4_7"
                                                position={[
                                                  0.00006698, 0.0165666, 0,
                                                ]}
                                              />
                                            </group>
                                          </group>
                                        </group>
                                        <group
                                          name="mixamorigLeftHandMiddle1_14"
                                          position={[
                                            -0.00805578, 0.0718711, -0.000974,
                                          ]}
                                          rotation={[
                                            0.34341384, 0.00744536, 0.00214556,
                                          ]}
                                        >
                                          <group
                                            name="mixamorigLeftHandMiddle2_13"
                                            position={[
                                              -0.00002669, 0.02550879, 0,
                                            ]}
                                            rotation={[
                                              0.52756136, -0.0140089,
                                              -0.05184259,
                                            ]}
                                          >
                                            <group
                                              name="mixamorigLeftHandMiddle3_12"
                                              position={[
                                                0.00000415, 0.02535939, 0,
                                              ]}
                                              rotation={[
                                                0.44635036, -0.01009176,
                                                -0.04445881,
                                              ]}
                                            >
                                              <group
                                                name="mixamorigLeftHandMiddle4_11"
                                                position={[
                                                  0.00002262, 0.02261096, 0,
                                                ]}
                                              />
                                            </group>
                                          </group>
                                        </group>
                                        <group
                                          name="mixamorigLeftHandPinky1_22"
                                          position={[
                                            0.0249527, 0.06025467, 0.00259503,
                                          ]}
                                          rotation={[
                                            0.49594576, -0.13306935,
                                            -0.05865397,
                                          ]}
                                        >
                                          <group
                                            name="mixamorigLeftHandPinky2_21"
                                            position={[
                                              -0.00003659, 0.01868013, 0,
                                            ]}
                                            rotation={[
                                              0.57107924, -0.01550328,
                                              -0.05278283,
                                            ]}
                                          >
                                            <group
                                              name="mixamorigLeftHandPinky3_20"
                                              position={[0, 0.01725602, 0]}
                                              rotation={[
                                                0.47133247, -0.01065015,
                                                -0.04434507,
                                              ]}
                                            >
                                              <group
                                                name="mixamorigLeftHandPinky4_19"
                                                position={[
                                                  0.00003573, 0.01419976, 0,
                                                ]}
                                              />
                                            </group>
                                          </group>
                                        </group>
                                        <group
                                          name="mixamorigLeftHandRing1_18"
                                          position={[
                                            0.00923293, 0.06926809, -0.00015922,
                                          ]}
                                          rotation={[
                                            0.4783155, 0.02002333, -0.07072023,
                                          ]}
                                        >
                                          <group
                                            name="mixamorigLeftHandRing2_17"
                                            position={[
                                              -0.00002312, 0.02327194, 0,
                                            ]}
                                            rotation={[
                                              0.59282053, -0.01657371,
                                              -0.05423661,
                                            ]}
                                          >
                                            <group
                                              name="mixamorigLeftHandRing3_16"
                                              position={[
                                                0.00004593, 0.02245514, 0,
                                              ]}
                                              rotation={[
                                                0.62160702, -0.01816878,
                                                -0.05652952,
                                              ]}
                                            >
                                              <group
                                                name="mixamorigLeftHandRing4_15"
                                                position={[
                                                  -0.00002291, 0.0195727, 0,
                                                ]}
                                              />
                                            </group>
                                          </group>
                                        </group>
                                        <group
                                          name="mixamorigLeftHandThumb1_6"
                                          position={[
                                            -0.02072162, -0.00034548,
                                            0.00954037,
                                          ]}
                                          rotation={[
                                            -0.02091432, 0.13279798, 0.57814159,
                                          ]}
                                        >
                                          <group
                                            name="mixamorigLeftHandThumb2_5"
                                            position={[
                                              -0.00179374, 0.03902276, 0,
                                            ]}
                                            rotation={[
                                              0.32385962, -0.01575719,
                                              -0.22141078,
                                            ]}
                                          >
                                            <group
                                              name="mixamorigLeftHandThumb3_4"
                                              position={[
                                                -0.00154372, 0.02977278, 0,
                                              ]}
                                              rotation={[
                                                -0.44420282, -0.12647188,
                                                0.22108485,
                                              ]}
                                            >
                                              <group
                                                name="mixamorigLeftHandThumb4_3"
                                                position={[
                                                  0.00333729, 0.02152999, 0,
                                                ]}
                                              />
                                            </group>
                                          </group>
                                        </group>
                                      </group>
                                    </group>
                                  </group>
                                </group>
                                <group
                                  name="mixamorigNeck_2"
                                  position={[0, 0.13205799, 0]}
                                  rotation={[
                                    0.09724753, -0.0051505, -0.00762547,
                                  ]}
                                >
                                  <group
                                    name="mixamorigHead_1"
                                    position={[
                                      -0.00365429, 0.07827683, 0.02877289,
                                    ]}
                                    rotation={[
                                      -0.15060076, -0.08784888, -0.16376824,
                                    ]}
                                  >
                                    <group
                                      name="mixamorigHeadTop_End_0"
                                      position={[0, 0.46157417, 0.10714687]}
                                    />
                                  </group>
                                </group>
                                <group
                                  name="mixamorigRightShoulder_80"
                                  position={[
                                    -0.04651817, 0.11408313, -0.00265106,
                                  ]}
                                  rotation={[1.51624875, 0.33824016, 1.7063949]}
                                >
                                  <group
                                    name="mixamorigRightArm_79"
                                    position={[0, 0.09927068, 0]}
                                    rotation={[
                                      0.87965098, 0.03869268, 0.09338327,
                                    ]}
                                  >
                                    <group
                                      name="mixamorigRightForeArm_78"
                                      position={[0, 0.22077952, 0]}
                                      rotation={[
                                        -1e-8, -0.00000452, -0.00466846,
                                      ]}
                                    >
                                      <group
                                        name="mixamorigRightHand_77"
                                        position={[0, 0.25456581, 0]}
                                        rotation={[
                                          -0.05894779, -0.21846246, -0.3379088,
                                        ]}
                                      >
                                        <group
                                          name="Ctrl_Index1_Right_67"
                                          position={[
                                            0.02759479, 0.07146639, 0.00206066,
                                          ]}
                                          rotation={[
                                            0.21084328, 0.01233863, -0.17121326,
                                          ]}
                                        >
                                          <group
                                            name="Ctrl_Index2_Right_66"
                                            position={[
                                              0.00001095, 0.02327875, 0,
                                            ]}
                                            rotation={[
                                              0.68873646, 0.01542038,
                                              0.04298874,
                                            ]}
                                          >
                                            <group
                                              name="Ctrl_Index3_Right_65"
                                              position={[
                                                -0.00000548, 0.02073783, 0,
                                              ]}
                                              rotation={[
                                                0.47998857, 0.00764465,
                                                0.03123715,
                                              ]}
                                            />
                                          </group>
                                        </group>
                                        <group
                                          name="Ctrl_Middle1_Right_70"
                                          position={[
                                            0.00842194, 0.06950849, 0.00073312,
                                          ]}
                                          rotation={[
                                            0.42633109, -0.00108047, -0.0935514,
                                          ]}
                                        >
                                          <group
                                            name="Ctrl_Middle2_Right_69"
                                            position={[
                                              0.00002094, 0.02609698, 0,
                                            ]}
                                            rotation={[
                                              0.60766274, 0.01155741,
                                              0.03685738,
                                            ]}
                                          >
                                            <group
                                              name="Ctrl_Middle3_Right_68"
                                              position={[
                                                -0.00000626, 0.02538626, 0,
                                              ]}
                                              rotation={[
                                                0.48888601, 0.00756315,
                                                0.03031942,
                                              ]}
                                            />
                                          </group>
                                        </group>
                                        <group
                                          name="Ctrl_Pinky1_Right_76"
                                          position={[
                                            -0.02544242, 0.06133549, 0.00244584,
                                          ]}
                                          rotation={[
                                            0.48608201, 0.21822379, 0.13984451,
                                          ]}
                                        >
                                          <group
                                            name="Ctrl_Pinky2_Right_75"
                                            position={[
                                              0.00001316, 0.0187408, 0,
                                            ]}
                                            rotation={[
                                              0.51777668, 0.00720877,
                                              0.02721864,
                                            ]}
                                          >
                                            <group
                                              name="Ctrl_Pinky3_Right_74"
                                              position={[
                                                -0.00000712, 0.01595719, 0,
                                              ]}
                                              rotation={[
                                                0.4178951, 0.00473274,
                                                0.02231892,
                                              ]}
                                            />
                                          </group>
                                        </group>
                                        <group
                                          name="Ctrl_Ring1_Right_73"
                                          position={[
                                            -0.00909088, 0.06823256,
                                            -0.00003993,
                                          ]}
                                          rotation={[
                                            0.547558, -0.01721389, -0.00174618,
                                          ]}
                                        >
                                          <group
                                            name="Ctrl_Ring2_Right_72"
                                            position={[
                                              0.00001546, 0.02311629, 0,
                                            ]}
                                            rotation={[
                                              0.63201581, 0.01162408,
                                              0.03554814,
                                            ]}
                                          >
                                            <group
                                              name="Ctrl_Ring3_Right_71"
                                              position={[
                                                -0.00001093, 0.02210407, 0,
                                              ]}
                                              rotation={[
                                                0.41553289, 0.00512126,
                                                0.02429228,
                                              ]}
                                            />
                                          </group>
                                        </group>
                                        <group
                                          name="Ctrl_Thumb1_Right_64"
                                          position={[
                                            0.0213442, -0.00206134, 0.00758887,
                                          ]}
                                          rotation={[
                                            0.11926779, -0.17295776,
                                            -0.58994751,
                                          ]}
                                        >
                                          <group
                                            name="Ctrl_Thumb2_Right_63"
                                            position={[
                                              0.00054882, 0.03988706, 0,
                                            ]}
                                            rotation={[
                                              0.21347933, -0.06063008,
                                              0.24999093,
                                            ]}
                                          >
                                            <group
                                              name="Ctrl_Thumb3_Right_62"
                                              position={[
                                                -0.00079955, 0.02967872, 0,
                                              ]}
                                              rotation={[
                                                -0.37338422, 0.16024926,
                                                -0.20773256,
                                              ]}
                                            />
                                          </group>
                                        </group>
                                        <group
                                          name="mixamorigRightHandIndex1_49"
                                          position={[
                                            0.02759479, 0.07146639, 0.00206066,
                                          ]}
                                          rotation={[
                                            0.21084328, 0.01233863, -0.17121326,
                                          ]}
                                        >
                                          <group
                                            name="mixamorigRightHandIndex2_48"
                                            position={[
                                              0.00001095, 0.02327875, 0,
                                            ]}
                                            rotation={[
                                              0.68873646, 0.01542038,
                                              0.04298874,
                                            ]}
                                          >
                                            <group
                                              name="mixamorigRightHandIndex3_47"
                                              position={[
                                                -0.00000548, 0.02073783, 0,
                                              ]}
                                              rotation={[
                                                0.47998857, 0.00764465,
                                                0.03123715,
                                              ]}
                                            >
                                              <group
                                                name="mixamorigRightHandIndex4_46"
                                                position={[
                                                  -0.00000542, 0.01730608, 0,
                                                ]}
                                              />
                                            </group>
                                          </group>
                                        </group>
                                        <group
                                          name="mixamorigRightHandMiddle1_53"
                                          position={[
                                            0.00842194, 0.06950849, 0.00073312,
                                          ]}
                                          rotation={[
                                            0.42633109, -0.00108047, -0.0935514,
                                          ]}
                                        >
                                          <group
                                            name="mixamorigRightHandMiddle2_52"
                                            position={[
                                              0.00002094, 0.02609698, 0,
                                            ]}
                                            rotation={[
                                              0.60766274, 0.01155741,
                                              0.03685738,
                                            ]}
                                          >
                                            <group
                                              name="mixamorigRightHandMiddle3_51"
                                              position={[
                                                -0.00000626, 0.02538626, 0,
                                              ]}
                                              rotation={[
                                                0.48888601, 0.00756315,
                                                0.03031942,
                                              ]}
                                            >
                                              <group
                                                name="mixamorigRightHandMiddle4_50"
                                                position={[
                                                  -0.00001458, 0.02180337, 0,
                                                ]}
                                              />
                                            </group>
                                          </group>
                                        </group>
                                        <group
                                          name="mixamorigRightHandPinky1_61"
                                          position={[
                                            -0.02544242, 0.06133549, 0.00244584,
                                          ]}
                                          rotation={[
                                            0.48608201, 0.21822379, 0.13984451,
                                          ]}
                                        >
                                          <group
                                            name="mixamorigRightHandPinky2_60"
                                            position={[
                                              0.00001316, 0.0187408, 0,
                                            ]}
                                            rotation={[
                                              0.51777668, 0.00720877,
                                              0.02721864,
                                            ]}
                                          >
                                            <group
                                              name="mixamorigRightHandPinky3_59"
                                              position={[
                                                -0.00000712, 0.01595719, 0,
                                              ]}
                                              rotation={[
                                                0.4178951, 0.00473274,
                                                0.02231892,
                                              ]}
                                            >
                                              <group
                                                name="mixamorigRightHandPinky4_58"
                                                position={[
                                                  -0.00000606, 0.01352195, 0,
                                                ]}
                                              />
                                            </group>
                                          </group>
                                        </group>
                                        <group
                                          name="mixamorigRightHandRing1_57"
                                          position={[
                                            -0.00909088, 0.06823256,
                                            -0.00003993,
                                          ]}
                                          rotation={[
                                            0.547558, -0.01721389, -0.00174618,
                                          ]}
                                        >
                                          <group
                                            name="mixamorigRightHandRing2_56"
                                            position={[
                                              0.00001546, 0.02311629, 0,
                                            ]}
                                            rotation={[
                                              0.63201581, 0.01162408,
                                              0.03554814,
                                            ]}
                                          >
                                            <group
                                              name="mixamorigRightHandRing3_55"
                                              position={[
                                                -0.00001093, 0.02210407, 0,
                                              ]}
                                              rotation={[
                                                0.41553289, 0.00512126,
                                                0.02429228,
                                              ]}
                                            >
                                              <group
                                                name="mixamorigRightHandRing4_54"
                                                position={[
                                                  -0.00000451, 0.01887207, 0,
                                                ]}
                                              />
                                            </group>
                                          </group>
                                        </group>
                                        <group
                                          name="mixamorigRightHandThumb1_45"
                                          position={[
                                            0.0213442, -0.00206134, 0.00758887,
                                          ]}
                                          rotation={[
                                            0.11926779, -0.17295776,
                                            -0.58994751,
                                          ]}
                                        >
                                          <group
                                            name="mixamorigRightHandThumb2_44"
                                            position={[
                                              0.00054882, 0.03988706, 0,
                                            ]}
                                            rotation={[
                                              0.21347933, -0.06063008,
                                              0.24999093,
                                            ]}
                                          >
                                            <group
                                              name="mixamorigRightHandThumb3_43"
                                              position={[
                                                -0.00079955, 0.02967872, 0,
                                              ]}
                                              rotation={[
                                                -0.37338422, 0.16024926,
                                                -0.20773256,
                                              ]}
                                            >
                                              <group
                                                name="mixamorigRightHandThumb4_42"
                                                position={[
                                                  0.00025086, 0.0220192, 0,
                                                ]}
                                              />
                                            </group>
                                          </group>
                                        </group>
                                      </group>
                                    </group>
                                  </group>
                                </group>
                              </group>
                              <group
                                name="Plane_90"
                                position={[-0.00060727, 0.01329787, 0.17318916]}
                                rotation={[0.10129587, 1.42242159, -1.45697811]}
                                scale={[0.06462728, 0.0646273, 0.06462728]}
                              />
                            </group>
                          </group>
                        </group>
                      </group>
                      <group name="MODZ_CHAIN_BY_CJ_GOLD_183" />
                      <group name="SUNGLASSES_GREEN_177_correction">
                        <group name="SUNGLASSES_GREEN_177" />
                      </group>
                    </group>
                  </group>
                </group>
              </group>
            </group>
            <skinnedMesh
              name="Object_15"
              geometry={nodes.Object_15.geometry}
              material={materials.Eye_moisture}
              skeleton={nodes.Object_15.skeleton}
            />
            <skinnedMesh
              name="Object_18"
              geometry={nodes.Object_18.geometry}
              material={materials["Air_Jordan_-_Black"]}
              skeleton={nodes.Object_18.skeleton}
            />
            <skinnedMesh
              name="Object_14"
              geometry={nodes.Object_14.geometry}
              material={materials.Eyelashes}
              skeleton={nodes.Object_14.skeleton}
            />
            <skinnedMesh
              name="Object_11"
              geometry={nodes.Object_11.geometry}
              material={materials.ANIME_HAIR}
              skeleton={nodes.Object_11.skeleton}
            />
            <skinnedMesh
              name="Object_17"
              geometry={nodes.Object_17.geometry}
              material={materials["Air_Jordan_-_Floor"]}
              skeleton={nodes.Object_17.skeleton}
            />
            <skinnedMesh
              name="Object_19"
              geometry={nodes.Object_19.geometry}
              material={materials["Air_Jordan_-_White"]}
              skeleton={nodes.Object_19.skeleton}
            />
            <skinnedMesh
              name="Object_202"
              geometry={nodes.Object_202.geometry}
              material={materials.SUNGLASSES_GREEN_GLASS}
              skeleton={nodes.Object_202.skeleton}
            />
            <skinnedMesh
              name="Object_21"
              geometry={nodes.Object_21.geometry}
              material={materials["Air_Jordan_-_Lace_red"]}
              skeleton={nodes.Object_21.skeleton}
            />
            <skinnedMesh
              name="Object_20"
              geometry={nodes.Object_20.geometry}
              material={materials["Air_Jordan_-_Red"]}
              skeleton={nodes.Object_20.skeleton}
            />
            <skinnedMesh
              name="Object_201"
              geometry={nodes.Object_201.geometry}
              material={materials.SUNGLASSES_GREEN}
              skeleton={nodes.Object_201.skeleton}
            />
            <skinnedMesh
              name="Object_7"
              geometry={nodes.Object_7.geometry}
              material={materials["23_J"]}
              skeleton={nodes.Object_7.skeleton}
            />
            <skinnedMesh
              name="Object_9"
              geometry={nodes.Object_9.geometry}
              material={materials.SHORTS_23_JERSEY_Baked}
              skeleton={nodes.Object_9.skeleton}
            />
            <skinnedMesh
              name="Object_23"
              geometry={nodes.Object_23.geometry}
              material={materials.MODZ_CHAIN_BY_CJ_GOLD_Baked}
              skeleton={nodes.Object_23.skeleton}
            />
            <skinnedMesh
              name="Object_13"
              geometry={nodes.Object_13.geometry}
              material={materials.DARK}
              skeleton={nodes.Object_13.skeleton}
            />
          </group>
        </group>
      </group>
    </>
  );
}

useGLTF.preload(CharacterModel);
