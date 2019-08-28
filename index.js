const Lambda = require('aws-sdk/clients/lambda')

module.exports.name = async (serverless) => {
  process.stdout.write(`${__filename}, ${JSON.stringify(serverless.service.custom.layers.latest)}\n`)

  const lambda = new Lambda({ region: serverless.service.provider.region })

  const entries = Object.entries(serverless.service.custom.layers.latest)
  const result = {}

  const { Layers } = await lambda.listLayers().promise()
  const layersMap = Layers.reduce((acc, layer) => { acc[layer.LayerName] = layer; return acc }, {})

  for (const [key, layerName] of entries) {
    result[key] = layersMap[layerName].LatestMatchingVersion.LayerVersionArn
  }

  return result
}
