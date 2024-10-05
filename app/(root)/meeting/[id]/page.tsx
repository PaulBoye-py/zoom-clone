"use client"
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'
import MeetingRoom from '@/components/MeetingRoom'
import MeetingSetup from '@/components/MeetingSetup'
import { useGetCallById } from '@/hooks/useGetCallById'
import Loader from '@/components/Loader'

const Meeting = ({ params: {id} }: { params: { id: string } }) => {

  const { user, isLoaded } = useUser()

  const [isSetUpComplete, setIsSetUpComplete] = useState(false)

  // get call and call loading state from custom hook
  const { call, isCallLoading } = useGetCallById(id)

  // if user is not loaded or call loading is still true
  if(!isLoaded || isCallLoading) return <Loader />
  return (
    <main className='h-screen w-full'>
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetUpComplete ? (
           <MeetingSetup setIsSetUpComplete={setIsSetUpComplete}/>
          ): (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting