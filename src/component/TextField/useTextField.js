import React from 'react'

const endpoint = `https://storage.googleapis.com/origin-test-bucket/test.csv?Expires=1608461485&GoogleAccessId=origin-test-bucket%40multi-k8s-287906.iam.gserviceaccount.com&Signature=I7nFjdrvvExXY9Yike67Cu%2BDxUwOooZlx%2FW4v1yIocGWFFejOOq%2FPDLDI1pGeJqGQsmU3FEnlQ9fC%2FYCSCG4ehSgO6YDJttXkdn3c77wHusmwZ2yzCmPJ5C%2B0FZhHlBuulYER2DFy%2FOPPrNwz4Yn5XotyXbCaeijNmkosPlOgrxsmfRzbriJWcF94YU7LcQvNok0f%2BmUTx%2BpTMVtaU9ERSteHdAClymxA8LVxOpYLb0oOMkV2bRGQAfJ2nTUmdMniIhpAZxDZSnv0QvOkiTAZGTJi2JsAVSJBiUTDiriTcrkoyD0OBu8oBmaQyB9nMmNSQy3YJoHgt8tlDf1JW6dPg%3D%3D`

const useTextField = ( intialState ) => {
  const [ values, setValues ] = React.useState( intialState )

  React.useEffect( () => {
    setValues( intialState )
  }, [ intialState ] )

  const handleChange = ( e ) => {
    const { name, value, files } = e.target
    e.persist()
    setValues( {
      ...values,
      [ name ]: files[ 0 ]
    } )
  }

  const handleSubmit = ( e ) => {
    if ( e ) e.preventDefault()
    uploadImage()
  }

  const uploadImage = () => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open( "PUT", endpoint, true );
    xhr.onload = () => {
      const { status } = xhr;
      if ( status === 200 ) {
        console.log( 'ok' )
      } else {
        console.log( `Error Status: ${ status }` );
      }
    };
    xhr.onerror = ( e ) => {
      console.log( `Error Status: ${ e.target.status }` );
    };
    xhr.upload.addEventListener( "progress", ( event ) => {
      if ( event.lengthComputable ) {
        const uploaded = ( ( event.loaded / event.total ) * 100 ) | 0;
        if ( uploaded === 100 ) {
          console.log( uploaded )
        }
      }
    } );
    xhr.setRequestHeader( "Access-Control-Allow-Headers", '*' )
    xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*' )
    xhr.setRequestHeader( "Content-Type", 'application/x-www-form-urlencoded' );
    xhr.setRequestHeader( 'Accept', 'application/json' )
    xhr.send( values.file );
  }

  return {
    values,
    handleChange,
    handleSubmit
  }
}
export default useTextField