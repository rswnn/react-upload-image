import { useState, useCallback } from "react";
import { toPng, OptionsType, toJpeg } from "html-to-image";

export const useScreenshot = ( selectID ) => {
  const theclass = selectID
  const { ref } = {};
  const [ image, setImage ] = useState();
  const [ isLoading, setLoading ] = useState( false );
  const [ modalIsOpen, setIsOpen ] = useState( false );


  const toggleModal = () => {
    setIsOpen( !modalIsOpen )
  }
  const closeModal = () => {
    setIsOpen( false )
  }

  const takeScreenshot = useCallback(
    async ( type, options ) => {
      setLoading( true );
      let tempImage;

      try {
        const body = document.getElementById( theclass );

        if ( type === "jpg" ) {
          tempImage = await toJpeg( ref?.current || body );
        } else {
          tempImage = await toPng( ref?.current || body );
        }

        setImage( tempImage );
      } catch ( e ) {
        console.error( e );
      } finally {
        setLoading( false );
        setIsOpen( true )

        return tempImage;
      }
    },
    []
  );

  const clear = useCallback( () => setImage( undefined ), [] );

  return { image, takeScreenshot, isLoading, clear, modalIsOpen, toggleModal, closeModal };
};

export default useScreenshot;