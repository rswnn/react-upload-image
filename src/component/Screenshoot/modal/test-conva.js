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

  const [highlight, setHighlight] = useState('');
  const [highlightBoxes, setHighlightBoxes] = useState([]);
  const [ocrLog, setOcrLog] = useState(null);
  const [ocrWords, setOcrWords] = useState([]);
  const [input, setInput] = useState('')
  useEffect(() => {
    if(image) {
      Tesseract.recognize(
        image,
        'eng',
        { logger: log => {
          //console.log(log);
          setOcrLog(log);
        } }
      ).then(({ data }) => {
        let mappedWords = data.words.map((word, i) =>{return {...word, id: i}})
        setOcrWords(mappedWords)
      })
    }
  }, [image])

  useEffect(() => {
    const highlitedWords = ocrWords.filter(word => word.text.toLowerCase() === highlight.toLowerCase())
    const newHighlightBoxes = highlitedWords.map(word => word.bbox)
    setHighlightBoxes(newHighlightBoxes);
  }, [ocrWords, highlight])

  const keywords = [
    'Ipsum',
    'lorem'
  ]

  const getBoxes = () => {
    console.log(input);
    let arrInput = input.split(' ');

    let result = [];
    arrInput.map(x => {
      ocrWords.forEach(word => {
        if (word.text.toLowerCase() === x.toLowerCase()) result.push(word);
      })
    })

    result.sort(function(a, b) { 
      return a.id - b.id  
    });

    let newRes = []
    result.forEach((x, i) => {
      if (i > 0) {
        if (x.id - result[i-1].id === 1) {
          newRes.forEach((newR, indexNewR) => {
            let indexId = newR.id.indexOf(result[i-1].id);
            if (indexId > -1) {
              newRes[indexNewR] = {
                ...newRes[indexNewR],
                x1: x.bbox.x1,
                y1: x.bbox.y1,
                id: [...newRes[indexNewR].id, x.id ]
              }
            }
          })
        } else {
          newRes.push({
            x0: x.bbox.x0,
            y0: x.bbox.y0,
            x1: x.bbox.x1,
            y1: x.bbox.y1,
            id: [x.id]
          })
        }
      } else {
        newRes.push({
          x0: x.bbox.x0,
          y0: x.bbox.y0,
          x1: x.bbox.x1,
          y1: x.bbox.y1,
          id: [x.id]
        })
      }
    })

    if (arrInput.length !== 1) {
      newRes = newRes.filter(x => x.id.length !== 1)
    }
   
    console.log('newRes', newRes)

    setHighlightBoxes(newRes);
  }

  return (
    <div>
      <p>Start to draw!</p>
      <div className='menu'>
        <p>Hover these words</p>
        { keywords.map((keyword, i) => (
          <p key={ i } onMouseEnter={() => setHighlight(keyword)} onMouseLeave={() => setHighlight('')} className='menu-item'>{ keyword }</p>
        ))}
      </div>
      <input value={input} onChange={ e => setInput(e.target.value) }/>
      <button onClick={getBoxes} >Search </button>
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