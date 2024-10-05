// Custom Hooks
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export const useGetCallById = (id: string | string[]) => {
    
    // state for call
    const [call, setCall] = useState<Call>()
    
    // state for call loading
    const [isCallLoading, setIsCallLoading] = useState(true)

    // stream video client
    const client = useStreamVideoClient()

    useEffect(() => {
        if(!client) return 

        const loadCall = async () => {

            // filter through available calls with the unique ID of a call
            const { calls } = await client.queryCalls({
                filter_conditions: {
                    id
                }
            })

            // set current call to the result gotten from filtering through using ID
            if(calls.length > 0) setCall(calls[0])

            setIsCallLoading(false)
        }

        loadCall()
    }, [client, id])

    
    return { call, isCallLoading }
}