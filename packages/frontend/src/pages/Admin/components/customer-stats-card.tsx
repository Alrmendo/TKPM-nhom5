import type React from "react"

interface CustomerStatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
}

export function CustomerStatsCard({ title, value, icon, color }: CustomerStatsCardProps) {
  return (
    <div className={`p-6 rounded-lg ${color}`}>
      <div className="flex items-center gap-4">
        <div className="bg-white p-2 rounded-full">{icon}</div>
        <div>
          <p className="text-white text-sm">{title}</p>
          <p className="text-white text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  )
}
