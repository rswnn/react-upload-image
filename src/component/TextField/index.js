import React from 'react'
import useTextField from './useTextField'

const intialState = {
  file: ''
}

const TextField = () => {

  const { values, handleChange, handleSubmit } = useTextField( intialState )

  return (
    <div>
      <form onSubmit={ handleSubmit }>
        <label htmlFor="file">Input</label>
        <input type="file" name="file" id="file" onChange={ handleChange } />
        <button type="submit">Upload</button>
      </form>
    </div>
  )
}

export default React.memo( TextField )
