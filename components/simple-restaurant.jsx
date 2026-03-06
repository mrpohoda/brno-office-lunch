import {VoteSection} from './vote-section'

export async function SimpleRestaurant({name, restaurantKey}) {
    return (
        <div className="col-md-6">
            <div className="border-start border-3 border-warning ps-3 mb-4" style={{background: 'rgba(255,193,7,0.06)', borderRadius: '0 6px 6px 0', padding: '10px 10px 10px 12px'}}>
                <div className="d-flex justify-content-between align-items-baseline mb-1">
                    <strong>{name}</strong>
                </div>
                <hr className="mt-0 mb-2"/>
                <div className="text-muted small">Menu není k dispozici online.</div>
                <VoteSection restaurantKey={restaurantKey}/>
            </div>
        </div>
    )
}
