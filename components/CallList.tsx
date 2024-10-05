'use client';

import { Call, CallRecording } from '@stream-io/video-react-sdk';

import Loader from './Loader';
import { useGetCalls } from '@/hooks/useGetCalls';
import MeetingCard from './MeetingCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings'}) => {

    // destructure the different call states from useGetCalls custom hook
    const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();

    // state for recordings
    const [recordings, setRecordings] = useState<CallRecording[]>([])

    const router = useRouter()

    const { toast } = useToast()

    // function to dynamically render the list as needed
    const getCalls = () => {
        switch (type) {
            case 'ended':
                return endedCalls;
            case 'recordings':
                return recordings;
            case 'upcoming':
                return upcomingCalls;
            default:
                return [];
        }
    }

    const getNoCallsMessage = () => {
        switch (type) {
            case 'ended':
                return 'No ended calls found';
            case 'recordings':
                return 'No call recordings found';
            case 'upcoming':
                return 'No upcoming calls found';
            default:
                return 'No calls found';
        }
    }

    // fetch recording for each call
    useEffect(() => {
      const fetchRecordings = async () => {
        try {
          // Check the calls that were recorded
          const callData = await Promise.all(
            callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
          );
    
          const recordings = callData
            .filter((call) => call.recordings.length > 0)
            .flatMap((call) => call.recordings);
    
          console.log('recordings', recordings);
    
          setRecordings(recordings);
        } catch (error: any) {
          console.error('error fetching recordings', error);
          toast({
            title: 'Failed to fetch recordings',
          });
        }
      };
      
      if (type === 'recordings') {
        fetchRecordings();
      }
    }, [type, callRecordings])

    const calls = getCalls()
    console.log('calls', calls)

    const noCallsMessage = getNoCallsMessage()

    if(isLoading) return <Loader />

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
          key={(meeting as Call).id}
          icon={
            type === 'ended'
              ? '/icons/previous.svg'
              : type === 'upcoming'
                ? '/icons/upcoming.svg'
                : '/icons/recordings.svg'
          }
          title={
            (meeting as Call).state?.custom?.description ||
            (meeting as CallRecording).filename?.substring(0, 20) ||
            'No Description'
          }
          date={
            (meeting as Call).state?.startsAt?.toLocaleString() ||
            (meeting as CallRecording).start_time?.toLocaleString()
          }
          isPreviousMeeting={type === 'ended'}
          buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
          handleClick={
            type === 'recordings'
              ? () => router.push(`${(meeting as CallRecording).url}`)
              : () => router.push(`/meeting/${(meeting as Call).id}`)
          }
          link={
            type === 'recordings'
              ? (meeting as CallRecording).url
              : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
          }
          buttonText={type === 'recordings' ? 'Play' : 'Start'}
          />
        ))
      ) : (
        <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList