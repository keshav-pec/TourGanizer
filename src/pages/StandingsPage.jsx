import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

export default function StandingsPage() {
  const { slug } = useParams()
  const [standings, setStandings] = useState([
    { rank: 1, team: 'Team Alpha', wins: 3, losses: 0, points: 9 },
    { rank: 2, team: 'Team Gamma', wins: 2, losses: 1, points: 6 },
    { rank: 3, team: 'Team Delta', wins: 1, losses: 2, points: 3 },
    { rank: 4, team: 'Team Beta', wins: 0, losses: 3, points: 0 },
  ])

  return (
    <div className="page">
      <div className="page-header">
        <h1>Standings — {slug}</h1>
        <button className="btn btn-secondary">Export</button>
      </div>
      
      <table className="standings-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {standings.map(s => (
            <tr key={s.rank}>
              <td className="rank">#{s.rank}</td>
              <td className="team-name">{s.team}</td>
              <td>{s.wins}</td>
              <td>{s.losses}</td>
              <td className="points">{s.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
