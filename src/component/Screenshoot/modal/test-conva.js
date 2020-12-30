import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image, Rect } from "react-konva";
import useImage from 'use-image';
import Rectangle from './reactangle'
import Tesseract from 'tesseract.js';

const DrawAnnotations = ( props ) => {
  const { images, highlightBoxes } = props
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
          {
            highlightBoxes.map((box, i) => (
              <Rect x={ box.x0 } y={ box.y0 } width={ box.x1 - box.x0 } height={ box.y1 - box.y0 } fill='red' opacity={ 0.5 } />
            ))
          }
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

  const [highlight, setHighlight] = useState('lorem');
  const [highlightBoxes, setHighlightBoxes] = useState([]);
  const [ocrLog, setOcrLog] = useState(null);
  const [ocrWords, setOcrWords] = useState([]);

  useEffect(() => {
    if(image) {
      Tesseract.recognize(
        image,
        'eng',
        { logger: log => {
          console.log(log);
          setOcrLog(log);
        } }
      ).then(({ data }) => {
        setOcrWords(data.words)
      })
    }
  }, [image])

  useEffect(() => {
    const highlitedWords = ocrWords.filter(word => word.text.toLowerCase() === highlight.toLowerCase())
    const newHighlightBoxes = highlitedWords.map(word => word.bbox)
    setHighlightBoxes(newHighlightBoxes);
  }, [ocrWords, highlight])

  const keywords = [
    'Lorem',
    'Ipsum'
  ]

  return (
    <div>
      <p>Start to draw!</p>
      <div className='menu'>
        <p>Hover these words</p>
        { keywords.map((keyword, i) => (
          <p key={ i } onMouseEnter={() => setHighlight(keyword)} onMouseLeave={() => setHighlight('')} className='menu-item'>{ keyword }</p>
        ))}
      </div>
      { ocrLog && (ocrLog.status === 'recognizing text' && ocrLog.progress === 1) ?
        <DrawAnnotations images={ image } highlightBoxes={ highlightBoxes } /> :
        <p>{`Processing OCR ${ocrLog ? `${ocrLog.status} ${ocrLog.progress}` : ''}`}</p>
      }
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