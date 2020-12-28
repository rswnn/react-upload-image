import React, { useState, useRef } from 'react'
import Modal from 'react-modal';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import ReactCrop from 'react-image-crop'
import "react-image-crop/dist/ReactCrop.css";
import TestKonva from './test-conva'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: 'tranparent'
  }
};
const atach = {
  unit: '%',
  width: 30,
  aspect: 16 / 9,
}

const pixelRatio = window.devicePixelRatio || 1;

// We resize the canvas down when saving on retina devices otherwise the image
// will be double or triple the preview size.
function getResizedCanvas( canvas, newWidth, newHeight ) {
  const tmpCanvas = document.createElement( "canvas" );
  tmpCanvas.width = newWidth;
  tmpCanvas.height = newHeight;

  const ctx = tmpCanvas.getContext( "2d" );
  ctx.drawImage(
    canvas,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    newWidth,
    newHeight
  );

  return tmpCanvas;
}

function generateDownload( previewCanvas, crop ) {
  if ( !crop || !previewCanvas ) {
    return;
  }

  const canvas = getResizedCanvas( previewCanvas, crop.width, crop.height );

  let img = canvas.toDataURL( 'image/png' )

  return img
}
const Modals = ( props ) => {
  const { modalIsOpen, closeModal, image } = props
  const [ multiple, setMultiple ] = React.useState( false )
  const imgRef = useRef( null );
  const previewCanvasRef = useRef( null );
  const [ crop, setCrop ] = useState( { unit: "%", width: 30, aspect: 16 / 9 } );
  const [ completedCrop, setCompletedCrop ] = useState( [] );
  const [ arrImg, setArrImg ] = React.useState()
  const [ data, setData ] = React.useState( [] )

  const cropperRef = useRef( null );
  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    console.log( cropper.getCroppedCanvas().toDataURL() );
  };

  const cropend = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    toggle( cropper )
    // cropper.clear()
  }

  const onLoad = React.useCallback( ( img ) => {
    imgRef.current = img;
  }, [] );

  React.useEffect( () => {
    if ( !completedCrop || !previewCanvasRef.current || !imgRef.current ) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext( "2d" );

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform( pixelRatio, 0, 0, pixelRatio, 0, 0 );
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  }, [ completedCrop ] );


  React.useEffect( () => {
    setData( prevData => [ ...prevData, arrImg ] )
    console.log( completedCrop )
  }, [ arrImg ] )

  const toggle = ( cropper ) => {
    const ele = document.querySelector( '.cropper-crop-box' )
    console.log( ele )
    const tooltip = document.getElementsByClassName( 'tooltip' ).length
    if ( ele && tooltip < 1 ) {
      const newDiv = document.createElement( "div" );
      newDiv.className = 'tooltip'
      newDiv.style.position = 'absolute'
      newDiv.style.top = "-20px"
      newDiv.style.background = "red"
      newDiv.style.height = "30px"
      newDiv.style.width = "30px"

      // and give it some content
      const newContent = document.createTextNode( "Save" );
      newDiv.addEventListener( 'click', () => {
        // const generate = generateDownload( previewCanvasRef.current, completedCrop )
        // arr.push( cropper.getCroppedCanvas().toDataURL() )
        setArrImg( cropper.getCroppedCanvas().toDataURL() )

        cropper.clear()
        cropper.crop()
      } )

      // add the text node to the newly created div
      newDiv.appendChild( newContent );
      ele.appendChild( newDiv )
    }
  }

  return (
    <Modal
      isOpen={ modalIsOpen }
      onRequestClose={ closeModal }
      style={ customStyles }
      contentLabel="Example Modal"
      style={ { overlay: { background: '#363636' } } }
    >
      <TestKonva image={ image } />

      {/* <div style={ { display: 'flex', flexDirection: 'row' } }>
        <div>
          { multiple ? image && <Cropper
            src={ image }
            style={ { height: 400, width: "100%" } }
            // Cropper.js options
            initialAspectRatio={ 16 / 9 }
            guides={ false }
            crop={ onCrop }
            ref={ cropperRef }
            cropend={ cropend }
            dragMode="crop"
            autoCrop
            data={ completedCrop }
          />
            : <img src={ image } style={ { width: '100%' } } /> }
          { data.map( res => (
            <img src={ res } />
          ) ) }
          <div>
            <canvas
              ref={ previewCanvasRef }
            // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
            // style={ {
            //   width: Math.round( completedCrop?.width ?? 0 ),
            //   height: Math.round( completedCrop?.height ?? 0 )
            // } }
            />
          </div>
        </div>
        <div onClick={ () => setMultiple( !multiple ) }>Multiple</div>
      </div> */}
    </Modal>
  )
}

export default Modals