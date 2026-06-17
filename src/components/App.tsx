import { type MouseEvent, useRef, useState } from 'react'

type MagnifierProps = {
  image: string
  width?: number | string
  zoom?: number
  magnifierWidth?: number
  magnifierHeight?: number
  borderWidth?: number
  borderColor?: string
}

const Magnifier = (props: MagnifierProps) => {
  const {
    image,
    width = '100%',
    zoom = 2,
    magnifierWidth = 150,
    magnifierHeight = 150,
    borderWidth = 2,
    borderColor = 'white',
  } = props

  const [left, setLeft] = useState(0)
  const [top, setTop] = useState(0)
  const [bgWidth, setBgWidth] = useState(0)
  const [bgHeight, setBgHeight] = useState(0)
  const [bgPosX, setBgPosX] = useState(0)
  const [bgPosY, setBgPosY] = useState(0)
  const [magnifierVisible, setMagnifierVisible] = useState(false)

  const imageDom = useRef<HTMLImageElement>(null)

  const onHover = (e: MouseEvent<HTMLImageElement>) => {
    if (!imageDom.current) return

    const { offsetX: mouseLeft, offsetY: mouseTop } = e.nativeEvent
    // rendered (on-screen) size of the image, regardless of its intrinsic size
    const { width: renderedWidth, height: renderedHeight } = imageDom.current

    // the magnified backdrop is the rendered image scaled up by `zoom`
    setBgWidth(zoom * renderedWidth)
    setBgHeight(zoom * renderedHeight)

    // the lens follows the cursor, centered on it
    setLeft(mouseLeft - magnifierWidth / 2 - borderWidth)
    setTop(mouseTop - magnifierHeight / 2 - borderWidth)

    // shift the backdrop so the point under the cursor sits at the lens center
    setBgPosX(magnifierWidth / 2 - zoom * mouseLeft)
    setBgPosY(magnifierHeight / 2 - zoom * mouseTop)
  }

  return (
    <div
      style={{ width, position: 'relative', cursor: 'none', display: 'inline-block', lineHeight: 0 }}
      onMouseOut={() => {
        setMagnifierVisible(false)
      }}
      onMouseOver={() => {
        if (!magnifierVisible) setMagnifierVisible(true)
      }}
    >
      <img
        src={image}
        style={{ width: '100%', display: 'block', maxWidth: 'none' }}
        ref={imageDom}
        onMouseMove={onHover}
        alt='img'
      />
      <div
        className='magnifier'
        style={{
          position: 'absolute',
          borderStyle: 'solid',
          borderRadius: '50%',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
          pointerEvents: 'none',
          display: magnifierVisible ? 'block' : 'none',
          left: left,
          top: top,
          width: magnifierWidth,
          height: magnifierHeight,
          borderWidth,
          borderColor,
          backgroundImage: `url(${image})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${bgWidth}px ${bgHeight}px`,
          backgroundPosition: `${bgPosX}px ${bgPosY}px`,
        }}
      />
    </div>
  )
}

export default Magnifier
