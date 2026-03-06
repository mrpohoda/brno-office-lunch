'use client'
import {useState, useEffect} from 'react'

export function VoteButton({restaurantKey, voters, toggleVote}) {
    const [name, setName] = useState('')
    const [inputName, setInputName] = useState('')
    const [askName, setAskName] = useState(false)
    const [pending, setPending] = useState(false)

    useEffect(() => {
        setName(localStorage.getItem('lunch-name') || '')
        const handler = (e) => setName(e.detail)
        window.addEventListener('lunch-name-changed', handler)
        return () => window.removeEventListener('lunch-name-changed', handler)
    }, [])

    const hasVoted = name && voters.includes(name)

    async function handleVote() {
        if (!name) {
            setAskName(true)
            return
        }
        setPending(true)
        await toggleVote(restaurantKey, name)
        setPending(false)
    }

    async function handleSetName(e) {
        e.preventDefault()
        const trimmed = inputName.trim()
        if (!trimmed) return
        localStorage.setItem('lunch-name', trimmed)
        window.dispatchEvent(new CustomEvent('lunch-name-changed', {detail: trimmed}))
        setName(trimmed)
        setAskName(false)
        setInputName('')
        setPending(true)
        await toggleVote(restaurantKey, trimmed)
        setPending(false)
    }

    return (
        <div className="mt-2 pt-2" style={{borderTop: '1px solid rgba(0,0,0,0.08)'}}>
            {voters.length > 0 && (
                <div className="d-flex flex-wrap gap-1 mb-2">
                    {voters.map(voter => (
                        voter === name ? (
                            <button key={voter} onClick={handleVote} disabled={pending}
                                    className="badge bg-success border-0"
                                    style={{fontSize: '0.72rem', cursor: 'pointer'}}>
                                ✓ {voter}
                            </button>
                        ) : (
                            <span key={voter}
                                  className="badge bg-secondary bg-opacity-10 text-secondary"
                                  style={{fontSize: '0.72rem'}}>
                                {voter}
                            </span>
                        )
                    ))}
                </div>
            )}

            {askName ? (
                <form onSubmit={handleSetName} className="d-flex gap-1 align-items-center">
                    <input
                        type="text"
                        value={inputName}
                        onChange={e => setInputName(e.target.value)}
                        placeholder="Tvoje jméno"
                        className="form-control form-control-sm"
                        style={{maxWidth: '140px'}}
                        autoFocus
                        maxLength={20}
                    />
                    <button type="submit" className="btn btn-sm btn-outline-success">OK</button>
                    <button type="button" className="btn btn-sm btn-link text-muted p-0"
                            onClick={() => setAskName(false)}>✕</button>
                </form>
            ) : !hasVoted ? (
                <div className="d-flex align-items-center gap-2">
                    <button
                        onClick={handleVote}
                        disabled={pending}
                        className="btn btn-sm btn-outline-secondary"
                        style={{fontSize: '0.75rem'}}
                    >
                        + Chci jít
                    </button>
                    {name && (
                        <button
                            className="btn btn-link btn-sm p-0 text-muted opacity-50"
                            style={{fontSize: '0.7rem'}}
                            onClick={() => {setInputName(name); setAskName(true)}}
                        >
                            {name}
                        </button>
                    )}
                </div>
            ) : null}
        </div>
    )
}
