import React from 'react'
import L from 'leaflet'
import { Auth } from 'aws-amplify'
import 'leaflet-path-transform'
import './BulkRegister.css'

import {
  formatCreateStack,
  formatUpdateStack,
  formatDeleteStack,
  getAllStacks
} from '../../services/request'
import { request } from '../../services/client'

const style = {
  height: '600px'
}

const intialState = {
  updateOn: false,
  createIsBlocked: false,
  bulkSaved: false,
  name: '',
  dimX: '',
  dimY: '',
  maxWeight: '',
  covered: false,
  errorMessage: '',
  formErrorMessage: ''
}

class Map extends React.Component {
  componentDidMount() {
    // create map
    this.map = L.map('map', {
      center: [-20.2930181, -40.2385113],
      zoom: 16,
      layers: [
        L.tileLayer(
          'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
          {
            attribution:
              'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken:
              'pk.eyJ1IjoiZHJlYWRub3VnaHQiLCJhIjoiY2pxcG40aG50MDNheTQzcG1oNTJ5dGZ1YyJ9.N2SDd0Xj-EOXSXm-NHhDGw'
          }
        )
      ]
    })
  }

  render() {
    return (
      <div>
        <div id="map" style={style} />
      </div>
    )
  }
}

class BulkRegister extends React.PureComponent {
  constructor(props) {
    super(props)

    this.bulks = []
    this.savedBulksId = []
    this.bulkSelected = null
    this.state = { ...intialState, loading: true }
  }

  componentDidMount() {
    const user = localStorage.getItem('_user')

    if (!user) {
      this.props.history.push('/')
    }

    this.setState({ loading: false }, async () => {
      try {
        const { data } = await request(getAllStacks)
        data.stacks.map(bulk => this.renderBulk(bulk))
        this.bulks.map(bulk =>
          bulk.transform.enable({ rotation: false, scaling: false })
        )
      } catch (err) {
        this.setState({
          errorMessage:
            'Não foi possível carregar as pilhas cadastradas. Tente novamente mais tarde.'
        })
        console.log(err)
      }
    })
  }

  createRectangle = ({ id, name, x, y, maxWeight, covered, angle, center }) => {
    const updateVerfication = () => {
      if (this.state.bulkSaved && this.state.bulkSaved !== 'updated') {
        this.setState({ bulkSaved: 'updated' })
      }
    }
    const _onBulkClick = bulkSelected => this.onBulkClick(bulkSelected)

    this.rectangle = L.rectangle(center.toBounds(12), {
      color: covered ? '#78ff00' : '#ff7800',
      weight: 1,
      interactive: true,
      draggable: true,
      transform: true,
      data: {
        backup: { id, name, dimension: { x, y }, maxWeight, covered, angle, geoPoint: center },
        id,
        name,
        x,
        y,
        maxWeight,
        covered,
        angle
      }
    })
      .on('mousedown', function () {
        _onBulkClick(this)
      })
      .on('rotateend', function (event) {
        this.options.data.angle = this.options.data.angle + event.rotation
        updateVerfication()
      })
      .on('dragend', function () {
        updateVerfication()
      })

    this.bulks = [...this.bulks, this.rectangle]
    this.rectangle.addTo(this.map.map)

    const p1 = this.rectangle
      .getCenter()
      .toBounds(this.rectangle.options.data.y)
    const p2 = this.rectangle
      .getCenter()
      .toBounds(this.rectangle.options.data.x)

    this.rectangle.setBounds(
      L.latLngBounds(
        L.latLng(p1.getNorthWest().lat, p2.getNorthWest().lng),
        L.latLng(p1.getSouthEast().lat, p2.getSouthEast().lng)
      )
    )
  }

  renderBulk = ({
    id,
    name,
    angle = 0,
    covered,
    maxWeight,
    dimension,
    geoPoint
  }) => {
    const { lat, lng } = geoPoint
    const center = L.latLng(lat, lng)

    const rectangleData = {
      center,
      id,
      name,
      x: dimension.x,
      y: dimension.y,
      maxWeight,
      covered,
      angle,
    }

    this.createRectangle(rectangleData)

    this.rectangle.transform.enable({ rotation: true, scaling: false })
    this.rectangle.transform.rotate(angle)
    this.bulkSelected = this.rectangle
  }

  addBulk = () => {
    const { name, dimX, dimY, maxWeight } = this.state
    if (!name.trim() || !dimX || !dimY || !maxWeight) {
      this.setState({
        formErrorMessage: 'Por favor, preencha todos os campos!'
      })

      return
    }

    const center = this.map.map.getCenter()

    const rectangleData = {
      center,
      id: this.bulks.length,
      name: this.state.name,
      x: this.state.dimX,
      y: this.state.dimY,
      maxWeight: this.state.maxWeight,
      covered: this.state.covered,
      angle: 0
    }

    this.createRectangle(rectangleData)

    this.onBulkClick(this.rectangle)

    this.setState({
      formErrorMessage: ''
    })
  }

  updateBulk = () => {
    this.bulkSelected.options.data.name = this.state.name
    this.bulkSelected.options.data.maxWeight = this.state.maxWeight

    this.setState({ createIsBlocked: true, bulkSaved: 'updated' })
  }

  deleteBulk = async () => {
    const bulkId = this.bulkSelected.options.data.id

    if (typeof bulkId === 'number') {
      this._removeBulkFromMap()
      return
    }

    const { errors, response } = await request(formatDeleteStack, bulkId)

    if (response.status !== 200 || errors) {
      this.setState({ ...intialState })
      return
    }

    this._removeBulkFromMap()
  }

  saveBulk = async () => {
    const { name, dimX: x, dimY: y, maxWeight, covered } = this.state
    const { id, angle } = this.bulkSelected.options.data
    const geoPoint = this.bulkSelected.getCenter()

    const bulkData = {
      id,
      name,
      angle,
      geoPoint,
      dimension: { x, y },
      covered,
      maxWeight,
    }

    try {
      this.setState({ ...intialState })

      if (typeof id !== 'number') { // update stack
        await request(formatUpdateStack, bulkData)
        this.bulkSelected.options.data = {
          ...bulkData,
          backup: { ...bulkData },
          x, y,
        }
        this.unselectBulk()
        return
      }

      const { data } = await request(formatCreateStack, bulkData)
      this.bulkSelected.options.data.id = data.createStack.id
    } catch (e) {
      this.setState({
        errorMessage:
          'Não foi possivel salvar este item neste momento. Tente novamente, caso aparece esse aviso novamente, tente mais tarde.'
      })
      console.log('Error: ', e)
    }
  }

  _removeBulkFromMap = () => {
    this.bulkSelected.transform.disable()
    this.bulkSelected.remove()
    this.bulkSelected = null
    this.setState({ ...intialState })
  }

  onBulkClick = bulkSelected => {
    if (this.bulkSelected !== bulkSelected) {
      this.unselectBulk()
    }

    this.bulks.map(bulk =>
      bulk.transform.enable({ rotation: false, scaling: false })
    )

    const { id, name, x, y, maxWeight, covered } = bulkSelected.options.data
    const bulkSaved = typeof id !== 'number'

    this.bulkSelected = bulkSelected

    bulkSelected.transform.enable({
      rotation: true,
      scaling: false
    })

    this.setState({
      createIsBlocked: true,
      updateOn: false,
      bulkSaved,
      dimX: x,
      dimY: y,
      name,
      maxWeight,
      covered
    })
  }

  unselectBulk = () => {
    if (!this.bulkSelected) {
      return
    }

    const initialBulkState = { ...this.bulkSelected.options.data.backup }
    this._removeBulkFromMap(this.bulkSelected)
    this.renderBulk(initialBulkState)

    this.bulkSelected.transform.disable()

    this.bulkSelected = null

    this.setState({ ...intialState })
  }

  onChange = e => {
    if (this.state.createIsBlocked) {
      this.setState({ updateOn: true })
    }

    const id = e.target.id
    const value = e.target.id === 'covered' ? e.target.checked : e.target.value

    this.setState({ [id]: value })
  }

  logout = () => {
    localStorage.removeItem('_user')
    Auth.signOut()
    this.props.history.push('/')
  }

  render() {
    let saveButtonLabel = 'Salvar selecionado'

    if (this.state.bulkSaved === 'updated') {
      saveButtonLabel = 'Atualizar selecionado'
    }

    if (this.state.loading) {
      return (
        <div className="text-center mt-5">
          <p>Carregando...</p>
        </div>
      )
    }

    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-10">
              <h1>Pilhas</h1>
            </div>
            <div className="col-2">
              <button
                className="btn btn-default btn-logout mt-1"
                onClick={this.logout}
              >
                Sair
              </button>
            </div>
          </div>
          <hr />

          <div className="row mb-1">
            <div className="col-1">
              <h3>Porto</h3>
            </div>

            <div className="col-8 top">
              <small className="ml-5 error-message">
                {this.state.errorMessage}
              </small>
              <div>
                <button
                  disabled={!this.bulkSelected}
                  type="button"
                  className="btn btn-danger btn-sm mr-2"
                  id="btAddbulk"
                  onClick={this.deleteBulk}
                >
                  Apagar selecionado
                </button>
                <button
                  disabled={!this.state.createIsBlocked}
                  type="button"
                  className="btn btn-primary btn-sm"
                  id="btAddbulk"
                  onClick={this.saveBulk}
                >
                  {saveButtonLabel}
                </button>
              </div>
            </div>

            <div className="col-3">
              <h3>Inspetor</h3>
            </div>
          </div>

          <div className="row">
            <div className="col-9">
              <Map ref={map => (this.map = map)} />
            </div>
            <div className="col-3">
              <form>
                <div className="form-group">
                  <label htmlFor="name">Nome</label>
                  <input
                    className="form-control"
                    id="name"
                    value={this.state.name}
                    onChange={this.onChange}
                    ref={name => (this.name = name)}
                    placeholder="Identificação da pilha"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Dimensões (metros)</label>
                  <div className="row">
                    <div className="col-5">
                      <input
                        className="form-control"
                        id="dimX"
                        value={this.state.dimX}
                        onChange={this.onChange}
                        ref={dimX => (this.dimX = dimX)}
                        type="number"
                        placeholder="X"
                        disabled={
                          this.state.createIsBlocked || this.state.updateOn
                        }
                      />
                    </div>
                    <div className="col-2 text-center">x</div>
                    <div className="col-5">
                      <input
                        className="form-control"
                        id="dimY"
                        value={this.state.dimY}
                        onChange={this.onChange}
                        ref={dimY => (this.dimY = dimY)}
                        type="number"
                        placeholder="Y"
                        disabled={
                          this.state.createIsBlocked || this.state.updateOn
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="maxWeight">Peso máximo (toneladas)</label>
                  <input
                    className="form-control"
                    id="maxWeight"
                    value={this.state.maxWeight}
                    onChange={this.onChange}
                    type="number"
                    ref={maxWeight => (this.maxWeight = maxWeight)}
                    placeholder="Peso máximo na pilha"
                  />
                </div>
                <div className="form-group form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="covered"
                    checked={this.state.covered}
                    onChange={this.onChange}
                    ref={covered => (this.covered = covered)}
                    disabled={this.state.createIsBlocked || this.state.updateOn}
                  />
                  <label className="form-check-label" htmlFor="covered">
                    Coberto (galpão)
                  </label>
                </div>
                <small className="error-message">
                  {this.state.formErrorMessage}
                </small>
                <hr />
                <div className="text-right">
                  <button
                    type="button"
                    id="btbulkSave"
                    className={`btn ${
                      this.state.createIsBlocked
                        ? 'btn-secondary'
                        : 'btn-primary'
                      }`}
                    onClick={
                      this.state.createIsBlocked
                        ? this.unselectBulk
                        : this.addBulk
                    }
                  >
                    {this.state.createIsBlocked ? 'Cancelar' : 'Nova pilha'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default BulkRegister
