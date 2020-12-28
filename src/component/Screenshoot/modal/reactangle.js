import React from 'react';
import { Stage, Layer, Rect, Transformer, Group } from 'react-konva';

const Rectangle = ( { shapeProps, isSelected, onSelect, onChange, x, y, width, height, pushImage, index, deleteSnippet, onMouseOver, onMouseOut } ) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();
  const [ tooltip, setTooltip ] = React.useState( false )

  React.useEffect( () => {
    if ( isSelected ) {
      trRef.current.nodes( [ shapeRef.current ] );
      trRef.current.getLayer().batchDraw();
    }
  }, [ isSelected ] );

  return (
    <Group draggable>
      <Rect
        x={ x }
        y={ y }
        width={ width }
        height={ height }
        fill="transparent"
        stroke="yellow"
        dash={ [ 10, 10 ] }
        onClick={ onSelect }
        onTap={ onSelect }
        ref={ shapeRef }
        { ...shapeProps }
        draggable
        onMouseOver={ onMouseOver }
        onMouseOut={ onMouseOut }
        onMouseDown={ () => setTooltip( true ) }
        onDragStart={ () => setTooltip( false ) }
        onDragEnd={ ( e ) => {
          setTooltip( true )
          onChange( {
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          } );
        } }
        onTransformEnd={ ( e ) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX( 1 );
          node.scaleY( 1 );
          onChange( {
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max( 5, node.width() * scaleX ),
            height: Math.max( node.height() * scaleY ),
          } );
        } }
      />
      {tooltip && isSelected && <Rect x={ x }
        y={ y - 10 } width={ 20 } height={ 20 } fill="blue" onClick={ () => pushImage( index ) } onMouseOver={ onMouseOver }
        onMouseOut={ onMouseOut } /> }
      {tooltip && isSelected && <Rect x={ x + 20 }
        y={ y - 10 } width={ 20 } height={ 20 } fill="red" onClick={ () => deleteSnippet( index ) } onMouseOver={ onMouseOver }
        onMouseOut={ onMouseOut } /> }
      {isSelected && (
        <Transformer
          x={ x }
          y={ y - 10 }
          ref={ trRef }
          borderDash={ [ 10, 10 ] }
          borderEnabled={ false }
          boundBoxFunc={ ( oldBox, newBox ) => {
            if ( newBox.width < 5 || newBox.height < 5 ) {
              return oldBox;
            }
            return newBox;
          } }
          rotateEnabled={ false }
          anchorFill="yellow"
          anchorStroke="transparent"
          onMouseOver={ onMouseOver }
          onMouseOut={ onMouseOut }
        />
      ) }
    </Group>
  );
};

export default Rectangle