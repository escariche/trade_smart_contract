import React from 'react'
import rolesPath from '../rolesPath'
import '../App.css'
const InfoPanel = ({error,
                       isLoading,
                       results,
                       account,
                       role}) => {
    return(
        <div className="block">
            { error != null && <p> Error: {error}</p>}
            { isLoading? <p>Loading...</p>:
                results === null ? <p>Couldn't connect with Ethereum</p>:
                    results.account === null ? <p>Couldn't connect to web3</p>:
                        results.role === -1 ? <p>Couldn't connect to DataMarket</p>:
                            <p>This is your {rolesPath[role]} address: {account}</p>
            }
        </div>
    )
}
export default InfoPanel