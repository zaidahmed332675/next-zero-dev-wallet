import { useEffect, useState } from "react"

function WagmiJWTExample() {
  const [jwt, setJWT] = useState('')
  const userId = window.crypto.getRandomValues(new Uint32Array(4)).join('-')

  useEffect(() => {
    fetch(`https://jwt-issuer.onrender.com/create-jwt/${userId}`).then(response => {
      response.text().then(setJWT)
    })
  }, [userId])

  const { chains, provider, webSocketProvider } = configureChains(
    [polygonMumbai],
    [infuraProvider({ apiKey: infuraApiKey })],
  )
  const client = createClient({
    autoConnect: false,
    provider,
    webSocketProvider,
  })

  const jwtConnector = new JWTWalletConnector({
    chains, options: {
      projectId: defaultProjectId,
      jwt
    }
  })

  const ConnectButton = () => {

    const [loading, setLoading] = useState(false)
    const { connect, error, isLoading, pendingConnector } = useConnect()
    const { address, connector, isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const { chain } = useNetwork()

    const connectWallet = async () => {
      setLoading(true)
      await connect({
        connector: jwtConnector
      })
      setLoading(false)
    }


    if (isConnected) {
      return (
        <div>
          <div>{address}</div>
          <div>Connected to {connector.name}</div>
          <a href={`${chain.blockExplorers.default.url}/address/${address}`} target="_blank">Explorer</a><br />
          <button onClick={() => {
            disconnect()
            fetch(`https://jwt-issuer.onrender.com/create-jwt/${userId}`).then(response => {
              response.text().then(setJWT)
            })
          }}>Disconnect</button>
        </div>
      )
    }
    return (
      <button disabled={isLoading || loading || !jwt} onClick={connectWallet}>
        {isLoading || loading ? 'loading...' : 'Connect with JWT'}
      </button>
    )
  }

  return (
    <WagmiConfig client={client}>
      <ConnectButton />
    </WagmiConfig>
  )
}