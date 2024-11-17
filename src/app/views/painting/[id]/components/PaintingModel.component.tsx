import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Color, Texture, TextureLoader } from 'three'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'

export default function PaintingModel(props: {
  imgUrl: string | undefined
  canvas: HTMLCanvasElement | undefined
}): JSX.Element {
  const { imgUrl } = props
  const [texture, setTexture] = useState<Texture>(new Texture())
  const loader: TextureLoader = new TextureLoader()
  const materialRef = useRef<any>()

  useEffect(() => {
    if (!imgUrl || imgUrl === '') return
    loader.load(
      imgUrl,
      (texture) => {
        // if (materialRef.current) {
        setTexture(texture)
        // }
      },
      (event: ProgressEvent) => console.log('progress', event),
      (err) => console.error(err)
    )
  }, [imgUrl])

  return (
    <Canvas shadows>
      {/* Scene color */}
      <color
        attach="background"
        args={[new Color('#fff').r, new Color('#fff').g, new Color('#fff').b]}
      />
      <OrbitControls />
      <Suspense>
        <mesh>
          <boxGeometry args={[3, 3, 3]} />
          <meshBasicMaterial
            color="rgb(255,255,255)"
            ref={materialRef}
            map={texture}
            // toneMapped={false}
            onUpdate={(self) => (self.needsUpdate = true)}
          />
        </mesh>
      </Suspense>
      <Environment preset="sunset" />
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.5}
        scale={10}
        blur={1}
        far={10}
        resolution={256}
        color="#000"
      />
    </Canvas>
  )
}
