import React, { useState, useRef } from 'react'

const Magnifier = (props: {
  image: string
  width?: number | string
  zoom?: number
  magnifierWidth?: number
  magnifierHeight?: number
  borderWidth?: number
  borderColor?: string
}) => {
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
  const [imageZoom, setImageZoom] = useState(1)
  const [magnifierVisible, setMagnifierVisible] = useState(false)
  const [magnifierImageLeft, setMagnifierImageLeft] = useState(0)
  const [magnifierImageTop, setMagnifierImageTop] = useState(0)

  const imageDom = useRef<any>()

  const onHover = (e: any) => {
    const { offsetX, offsetY } = e.nativeEvent
    const mouseTop = offsetY
    const mouseLeft = offsetX
    const { width, naturalWidth } = imageDom.current

    const imageZoom = (zoom * width) / naturalWidth
    setImageZoom(imageZoom)

    const left = mouseLeft - magnifierWidth / 2 - borderWidth
    const top = mouseTop - magnifierHeight / 2 - borderWidth
    setLeft(left)
    setTop(top)

    const magnifierImageLeft = magnifierWidth / 2 + borderWidth - zoom * mouseLeft
    const magnifierImageTop = magnifierHeight / 2 + borderWidth - zoom * mouseTop
    setMagnifierImageLeft(magnifierImageLeft)
    setMagnifierImageTop(magnifierImageTop)
  }

  return (
    <div
      style={{ width, position: 'relative', cursor: 'none' }}
      onMouseOut={() => {
        setMagnifierVisible(false)
      }}
      onMouseOver={() => {
        !magnifierVisible && setMagnifierVisible(true)
      }}
    >
      <img src={image} style={{ width: '100%' }} ref={imageDom} onMouseMove={onHover} alt='img' />
      <div
        className='magnifier'
        style={{
          position: 'absolute',
          border: '1px solid  red',
          borderRadius: '50%',
          boxShadow: '0 0 20px #000',
          overflow: 'hidden',
          pointerEvents: 'none',
          display: magnifierVisible ? 'block' : 'none',
          left: left,
          top: top,
          width: magnifierWidth,
          height: magnifierHeight,
          borderWidth,
          borderColor,
        }}
      >
        <img
          src={image}
          className='magnifierImage'
          style={{
            position: 'absolute',
            left: magnifierImageLeft,
            top: magnifierImageTop,
            transform: `scale(${imageZoom})`,
            transformOrigin: 'left top',
          }}
          alt='img'
        />
      </div>
    </div>
  )
}

export default Magnifier
