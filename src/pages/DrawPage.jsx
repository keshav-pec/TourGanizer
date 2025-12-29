import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

export default function DrawPage() {
  const { slug } = useParams()
  const [rounds, setRounds] = useState([
    { round: 1, matches: [
      { room: 'Room A', team1: 'Team Alpha', team2: 'Team Beta', adjudicator: 'Judge Smith' },
      { room: 'Room B', team1: 'Team Gamma', team2: 'Team Delta', adjudicator: 'Judge Jones' },
    ]}
  ])

  return (
    <div className="page">
      <div className="page-header">
        <h1>Draw — {slug}</h1>
        <button className="btn btn-primary">Generate Next Round</button>
      </div>
      
      {rounds.map(r => (
        <div key={r.round} className="round-section">
          <h2>Round {r.round}</h2>
          <table className="draw-table">
            <thead>
              <tr>
                <th>Room</th>
                <th>Affirmative</th>
                <th>Negative</th>
                <th>Adjudicator</th>
              </tr>
            </thead>
            <tbody>
              {r.matches.map((m, i) => (
                <tr key={i}>
                  <td>{m.room}</td>
                  <td>{m.team1}</td>
                  <td>{m.team2}</td>
                  <td>{m.adjudicator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
