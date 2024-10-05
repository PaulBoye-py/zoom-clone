"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import ReactDatePicker from 'react-datepicker'



const MeetingTypeList = () => {
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: ''
    })
    // state for call details
    const [callDetails, setCallDetails] = useState<Call>()

    // shadcn toast for notifications
    const { toast } = useToast()

    // get user from clerk
    const { user } = useUser()

    // initialize a stream video client
    const client = useStreamVideoClient()

    const router = useRouter()

    const createMeeting = async () => {
        if(!client || !user) return

        try {

            if(!values.dateTime) {
                toast({title: "Please select a date and time"})
                return;
            }

            // generate a meeting ID
            const id = crypto.randomUUID()
            
            // generate a call
            const call = client.call('default', id)

            if(!call) throw new Error('failed to create a call')
            
            // start time for meeting
            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();

            // meeting description
            const description = values.description || 'Instant Meeting';

            // call function
            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description
                    }
                }
            })
            // set call details
            setCallDetails(call)

            if(!values.description) {
                router.push(`/meeting/${call.id}`)
            }

            toast({title: "Meeting Created"})

        } catch (error) {
            console.error('error creating a meeting', error)
            toast({
                title: "Failed to create a meeting",
              })
        }
    }

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`
  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard 
            img='/icons/add-meeting.svg'
            title='New Meeting'
            description='Start a new meeting'
            handleClick={() => setMeetingState('isInstantMeeting')}
            className='bg-orange-1'
        />

        <HomeCard 
            img='/icons/schedule.svg'
            title='Schedule Meeting'
            description='Plan your meeting'
            handleClick={() => setMeetingState('isScheduleMeeting')}
            className='bg-blue-1'
        />  

        <HomeCard 
            img='/icons/recordings.svg'
            title='View Recordings'
            description='Check out previous meetings'
            handleClick={() => router.push('/recordings')}
            className='bg-purple-1'
        />

        <HomeCard 
            img='/icons/join-meeting.svg'
            title='Join Meeting'
            description='via an invitation meeting'
            handleClick={() => setMeetingState('isJoiningMeeting')}
            className='bg-yellow-1'
        />    

        {/* Modals for different scenarios */}
        {!callDetails ? (
            <MeetingModal
                isOpen={meetingState === 'isScheduleMeeting'}
                onClose={() => setMeetingState(undefined)} 
                title='Schedule a meeting'
                handleClick={createMeeting}
            >

                <div className='flex flex-col gap-2.5 '>
                    <label className='text-base text-normal leading-[22px] text-sky-2'>Add a description</label>
                    <Textarea 
                        className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
                        onChange={(e) => {
                            setValues({...values, description: e.target.value})
                        }}
                        
                    />
                </div>

                <div className='flex w-full flex-col gap-2.5 '>
                    <label className='text-base text-normal leading-[22px] text-sky-2'>Select date and time</label>
                    <ReactDatePicker 
                        selected={values.dateTime}
                        onChange={(date) => setValues({...values, dateTime: date!})}
                        showTimeSelect
                        timeFormat='HH:mm'
                        timeIntervals={15}
                        dateFormat='MMMM d, yyyy h:mm aa'
                        timeCaption='Select time'
                        className='w-full rounded border-none p-2 bg-dark-3 focus:outline-none'
                    />

                </div>

            </MeetingModal>
        ): (
            <MeetingModal
                isOpen={meetingState === 'isScheduleMeeting'}
                onClose={() => setMeetingState(undefined)}
                title='Meeting Created'
                className='text-center'
                buttonText='Copy Meeting Link'
                handleClick={() => {
                    navigator.clipboard.writeText(meetingLink)
                    toast({title: "Meeting link copied to clipboard"})
                }}
                image='/icons/checked.svg'
                buttonIcon='/icons/copy.svg'
            />
        )}
        <MeetingModal 
            isOpen={meetingState === 'isInstantMeeting'}
            onClose={() => setMeetingState(undefined)}
            title='Start an instant meeting'
            className='text-center'
            buttonText='Start Meeting'
            handleClick={createMeeting}

        />

    </section>
  )
}

export default MeetingTypeList