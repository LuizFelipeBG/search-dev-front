export const formatCreateStack = ({
  name,
  angle,
  covered,
  geoPoint,
  maxWeight,
  dimension,
}) => `
mutation { 
    createStack(data: {
      name: ${JSON.stringify(name || '')}
      angle: ${angle}
      covered: ${JSON.stringify(covered)}
      maxWeight: ${maxWeight || '0'}
      dimension: { create: { 
          x: ${dimension.x}
          y: ${dimension.y} 
        } 
      }
      geoPoint: { create: { 
          lat: ${JSON.stringify(geoPoint.lat)}
          lng: ${JSON.stringify(geoPoint.lng)} 
        } 
      }
    }
    ){
      name
      angle
      covered
      maxWeight
      id
      dimension {
        x
        y
      }
      geoPoint {
        lat
        lng
      }
    }
    }
`

export const formatUpdateStack = ({ id, name, maxWeight, geoPoint, angle }) => `
mutation {
  updateStack(
    where: { id: ${JSON.stringify(id)} }
    data: {
      name: ${JSON.stringify(name)}
      maxWeight: ${maxWeight || 0}
      angle: ${angle}
      geoPoint: { 
        update: {
          lat: ${JSON.stringify(geoPoint.lat)}
          lng: ${JSON.stringify(geoPoint.lng)} 
        }
      }
    }
  ){
    id
    name
    maxWeight
    angle
    geoPoint {
      lat
      lng
    }
  }
}
`

export const formatDeleteStack = bulkId => `
mutation {
  deleteStack(id: ${JSON.stringify(bulkId)}){
    id
  }
}
`

export const getAllStacks = () => `
{
  stacks {
    id
    name
    angle
    covered
    maxWeight
    dimension {
      x
      y
    }
    geoPoint {
      lat
      lng
    }
  }
}
`
