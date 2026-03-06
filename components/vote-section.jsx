import {getVotes, toggleVote} from '../utils/votes'
import {VoteButton} from './vote-button'

export async function VoteSection({restaurantKey}) {
    const votes = await getVotes()
    const voters = votes[restaurantKey] || []
    return <VoteButton restaurantKey={restaurantKey} voters={voters} toggleVote={toggleVote} />
}
