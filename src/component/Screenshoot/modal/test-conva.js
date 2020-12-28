import React, { useState, useRef } from "react";
import { Stage, Layer, Image, } from "react-konva";
import useImage from 'use-image';
import Rectangle from './reactangle'

const DrawAnnotations = ( props ) => {
  const { images } = props
  const [ image ] = useImage( images )
  const [ annotations, setAnnotations ] = useState( [] );
  const [ newAnnotation, setNewAnnotation ] = useState( [] );
  const [ stage, setStage ] = useState( true )
  const [ data, setData ] = useState( [] )
  const imgRef = useRef()
  const [ selectedId, selectShape ] = React.useState( null );

  const handleMouseDown = event => {
    if ( stage ) {
      if ( newAnnotation.length === 0 ) {
        const { x, y } = event.target.getStage().getPointerPosition();
        setNewAnnotation( [ { x, y, width: 0, height: 0, key: "0" } ] );
      }
    }
    const clickedOnEmpty = event.target === event.target.getStage();
    if ( clickedOnEmpty ) {
      selectShape( null );
    }
  };

  const handleMouseUp = event => {
    if ( newAnnotation.length === 1 ) {
      const sx = newAnnotation[ 0 ].x;
      const sy = newAnnotation[ 0 ].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      if ( x - sx !== 0 && y - sy !== 0 ) {
        const annotationToAdd = {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          key: annotations.length + 1,
          id: annotations.length + 1,
        };
        annotations.push( annotationToAdd );
        setNewAnnotation( [] );
        setAnnotations( annotations );

      }
    }
    const clickedOnEmpty = event.target === event.target.getStage();
    if ( clickedOnEmpty ) {
      selectShape( null );
    }

  };

  const pushImage = ( index ) => {
    let fil = imgRef.current.toDataURL( {
      x: annotations[ index ].x,
      y: annotations[ index ].y,
      width: annotations[ index ].width,
      height: annotations[ index ].height,
    } )
    setData( prevSate => [ ...prevSate, fil ] )
  }

  const handleMouseMove = event => {
    if ( newAnnotation.length === 1 ) {
      const sx = newAnnotation[ 0 ].x;
      const sy = newAnnotation[ 0 ].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      setNewAnnotation( [
        {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
        }
      ] );
    }
  };

  const deleteSnippet = index => {
    setAnnotations( annotations.filter( ( item, i ) => {
      return i !== index
    } ) )
    setStage( true )
  }
  const annotationsToDraw = [ ...annotations, ...newAnnotation ];
  return (
    <div>
      <Stage
        onMouseDown={ handleMouseDown }
        onMouseUp={ handleMouseUp }
        onMouseMove={ handleMouseMove }
        width={ 1280 }
        height={ 700 }
      >
        <Layer >
          <Image image={ image } ref={ imgRef } />
          { annotationsToDraw.map( ( value, index ) => {
            return (
              <Rectangle
                x={ value.x }
                y={ value.y }
                width={ value.width }
                height={ value.height }
                key={ index }
                shapeProps={ value }
                isSelected={ value.id === selectedId }
                onSelect={ () => {
                  selectShape( value.id );
                } }
                onChange={ ( newAttrs ) => {
                  const rects = annotationsToDraw.slice();
                  rects[ index ] = newAttrs;
                  setAnnotations( rects );
                } }
                index={ index }
                pushImage={ pushImage }
                deleteSnippet={ deleteSnippet }
                onMouseOver={ () => {
                  setStage( false )
                } }
                onMouseOut={ () => {
                  setStage( true )
                } }
              />
            );
          } ) }
        </Layer>
      </Stage>
      {data.map( res => (
        <img src={ res } />
      ) ) }
    </div>
  );
};

const TestKonva = ( props ) => {
  const { image } = props
  return (
    <div>
      <p>Start to draw!</p>
      <DrawAnnotations images={ image } />
    </div>
  );
}

export default TestKonva

// const { x, y } = event.target.getStage().getPointerPosition();
//         annotations.map( ( res ) => {
//           const lebar = res.x + res.width
//           const tinggi = res.y + res.height
//           if ( x > lebar && x < lebar && y > tinggi && y < tinggi ) {
//             setNewAnnotation( [ { x, y, width: 0, height: 0, key: "0" } ] );
//           }
//         } )