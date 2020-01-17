import React from 'react'

const Input = ({
  divClass = '',
  id,
  label,
  reference,
  type = 'text',
  placeholder,
  onKeyDown = () => null,
  required = true
}) => {
  return (
    <div className={`form-group ${divClass}`}>
      <label htmlFor={id}>{label}</label>
      <input
        ref={reference}
        type={type}
        className="form-control"
        id={id}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        required={required}
      />
    </div>
  )
}

export default Input
