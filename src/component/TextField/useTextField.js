import React from 'react'

const endpoint = `https://storage.googleapis.com/origin-test-bucket/test.png?Expires=1608664320&GoogleAccessId=origin-test-bucket%40multi-k8s-287906.iam.gserviceaccount.com&Signature=oOsh94aty3hv2%2BdBos4xTtFvZaUZyVsbAUgXPtkw0I3QJVsmObrTmxtpcyptdZXVAmBHe287H6gVqoDJf%2BcWWAbtYFC2%2BZz8IE949xV8PwJQBeDEfn8YwaII8S%2FbbL1COUMaV89tL%2F1Bq4dr8JeTyuOquFXNsIhZOaZ2rzsKfzTiZtAg8G4iKdqUr3dWjCkf4M%2Bvay9G1B4upcGVYg1B0A9%2B6mkHfZdUYrBcNV1xj0oJQ4JW3y7ZhhurAMgVqXEtszWv%2F14S1W1Xq9Bf1ck01YYc9aeUW9V66ONSqiJITUf8nggUJTTNvM4xUFsu0TwpRx7qPr0nyZhNrHzXtqiIKA%3D%3D`

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
    xhr.setRequestHeader( "Content-Type", values.file.type );
    xhr.send( values.file );
  }

  return {
    values,
    handleChange,
    handleSubmit
  }
}
export default useTextField