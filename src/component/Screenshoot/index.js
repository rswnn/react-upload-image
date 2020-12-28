import React from 'react'
import { useScreenshot } from './useScreenshoot'
import CaptureImage from '../../assets/capture.png'
import Modal from './modal'
const ScreenShoot = ( props ) => {

  const { selectID } = props
  const { image, takeScreenshot, modalIsOpen, toggleModal, closeModal } = useScreenshot( selectID );
  return (
    <div>
      <div style={ {
        position: 'absolute',
        right: 30,
      } }>
        <button onClick={ takeScreenshot }>
          <img style={ { width: 100, height: 70 } } src={ CaptureImage } />
        </button>
      </div>
      <Modal image={ image } modalIsOpen={ modalIsOpen } closeModal={ closeModal } />
    </div>
  )
}

export default ScreenShoot
