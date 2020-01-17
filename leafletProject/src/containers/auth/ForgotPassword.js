import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Auth } from 'aws-amplify'

import Input from '../../components/Input'
import LogoContainer from '../../components/logo/Logo'

export default class ForgotPassword extends Component {
  state = { msg: '' }

  onForgotSubmit = async event => {
    event.preventDefault()

    try {
      await Auth.forgotPassword(this.email.value.trim())
      this.props.history.push('/nova-senha', { hideCodeField: false })
    } catch (err) {
      console.error('--> ', err)

      if (err.message === 'Username/client id combination not found.') {
        this.setState({ msg: 'Usuário inexistente' })
      }

      if (
        err.message === 'Attempt limit exceeded, please try after some time.'
      ) {
        this.setState({
          msg: 'Excedeu o numero de tentativas, tente mais tarde.'
        })
      }
    }
  }

  render() {
    return (
      <LogoContainer>
        <form onSubmit={this.onForgotSubmit}>
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="exemplo@exemplo.com"
            reference={email => (this.email = email)}
          />
          <div className="under-form">
            <button type="submit" className="btn btn-primary">
              Enviar
            </button>
            <small className="error-message">{this.state.msg}</small>
            <Link to="/">Voltar</Link>
          </div>
        </form>
      </LogoContainer>
    )
  }
}
