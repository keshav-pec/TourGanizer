import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

export default function ResultsPage() {
  const { slug } = useParams()
  const [results, setResults] = useState([
    { round: 1, room: 'Room A', winner: 'Team Alpha', loser: 'Team Beta', decision: 'Unanimous' },
    { round: 1, room: 'Room B', winner: 'Team Gamma', loser: 'Team Delta', decision: 'Split 2-1' },
  ])

  return (
    <div className="page">
      <div className="page-header">
        <h1>Results — {slug}</h1>
        <button className="btn btn-primary">Enter Result</button>
      </div>
      
      <table className="results-table">
        <thead>
          <tr>
            <th>Round</th>
            <th>Room</th>
            <th>Winner</th>
            <th>Loser</th>
            <th>Decision</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td>{r.round}</td>
              <td>{r.room}</td>
              <td className="winner">{r.winner}</td>
              <td>{r.loser}</td>
              <td>{r.decision}</td>
              <td><button className="btn-text">Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
