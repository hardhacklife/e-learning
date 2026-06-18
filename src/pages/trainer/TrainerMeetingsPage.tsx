import { cn } from '@/lib/utils'
import {
  getMeetingTypeLabel,
  MOCK_TRAINER_MEETINGS,
  type TrainerMeeting,
} from '@/mocks/data/trainerMeetings'

const typeStyles: Record<TrainerMeeting['type'], string> = {
  preparation_cours: 'bg-blue-50 text-blue-700',
  preparation_eval: 'bg-violet-50 text-violet-700',
  suivi_tutorat: 'bg-emerald-50 text-emerald-700',
}

export function TrainerMeetingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">
          Réunions pédagogiques
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Préparation des cours, évaluations et suivi tutorat
        </p>
      </div>

      <ul className="space-y-3">
        {MOCK_TRAINER_MEETINGS.map((meeting) => {
          const date = new Date(meeting.date)
          const formattedDate = date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })

          return (
            <li
              key={meeting.id}
              className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {meeting.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {meeting.formationTitle}
                  </p>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium',
                    typeStyles[meeting.type],
                  )}
                >
                  {getMeetingTypeLabel(meeting.type)}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 text-xs text-slate-500">
                <span className="capitalize">{formattedDate}</span>
                <span>{meeting.time}</span>
                <span>{meeting.location}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
