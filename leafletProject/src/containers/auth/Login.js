import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../../AwsConfig'
import { Auth } from 'aws-amplify'

import Input from '../../components/Input'
import LogoContainer from '../../components/logo/Logo'

const codeMessag =
  'Digite o codigo enviado para seu email para confirmar sua conta.'

export default class Login extends Component {
  state = {
    hideCodeField: true,
    hideRegister: true,
    loading: false,
    loginError: ''
  }

  componentWillMount() {
    const user = localStorage.getItem('_user')
    if (user) {
      this.props.history.push('/pilhas')
    }
  }

  onLoginSubmit = async event => {
    event.preventDefault()

    const saveUser = dataUser => {
      const { accessToken, idToken } = dataUser.signInUserSession

      const userIdentification = {
        token: accessToken.jwtToken,
        name: idToken.payload.name,
        email: dataUser.username
      }

      localStorage.setItem('_user', JSON.stringify(userIdentification))
      this.props.history.push('/pilhas')
    }

    try {
      const { state } = this.props.location
      const hideCodeField = state ? state.hideCodeField : true

      this.setState({ loading: true, loginError: '' })

      if (!hideCodeField) {
        await Auth.forgotPasswordSubmit(
          this.username.value.trim(),
          this.code.value.trim(),
          this.password.value.trim()
        )
        this.props.history.replace('/', { hideCodeField: true })
        return
      }

      const user = await Auth.signIn(
        this.username.value.trim(),
        this.password.value.trim()
      )
      saveUser(user)
    } catch (err) {
      console.error('----> ', err)

      if (err.message === 'User does not exist.') {
        this.setState({ loginError: 'Usuário inexistente', loading: false })
      }

      if (err.message === 'Incorrect username or password.') {
        this.setState({
          loginError: 'Usuário ou senha incorreta',
          loading: false
        })
      }
    }
  }

  render() {
    const { loginError, hideRegister } = this.state
    const { state } = this.props.location
    const hideCodeField = state ? state.hideCodeField : true

    return (
      <LogoContainer>
        <form onSubmit={this.onLoginSubmit}>
          <Input
            id="username"
            label="Usuário"
            placeholder="Nome de usuário"
            reference={username => (this.username = username)}
            onKeyDown={event => event.which === 13 && this.password.focus()}
          />
          <Input
            id="password"
            label={hideCodeField ? 'Senha' : 'Nova senha'}
            type="password"
            placeholder="Senha"
            reference={password => (this.password = password)}
            onKeyDown={event =>
              event.which === 13 && this.code ? this.code.focus() : null
            }
          />
          {hideCodeField || (
            <React.Fragment>
              <Input
                id="code"
                label="Código"
                placeholder="Codigo"
                reference={code => (this.code = code)}
              />
              <small className="error-message">{codeMessag}</small>
            </React.Fragment>
          )}

          <div className="form-group form-check under-form">
            <button type="submit" className="btn btn-primary">
              Entrar
            </button>
            <small className="error-message">{loginError}</small>
            <Link to="/recuperar-senha">Esqueci a senha</Link>
          </div>
          {hideRegister || (
            <Link to="/cadastrar" className="btn btn-secondary ml-3">
              Cadastrar
            </Link>
          )}
          {this.state.loading && (
            <p className="mt-5 text-center">Entrando...</p>
          )}
        </form>
      </LogoContainer>
    )
  }
}
