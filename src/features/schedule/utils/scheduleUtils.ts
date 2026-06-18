const SLOT_HEIGHT = 44
const START_HOUR = 8
const END_HOUR = 17

export const SCHEDULE_CONFIG = {
  slotHeight: SLOT_HEIGHT,
  startHour: START_HOUR,
  endHour: END_HOUR,
}

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours! * 60 + minutes!
}

export function minutesToTime(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

/** Index de créneau 30 min depuis le début de la grille (8h). */
export function yOffsetToSlotIndex(y: number) {
  const maxSlot = (END_HOUR - START_HOUR) * 2 - 1
  return Math.max(0, Math.min(Math.floor(y / SLOT_HEIGHT), maxSlot))
}

export function slotIndexToTimeRange(
  slotIndex: number,
  durationMinutes = 120,
) {
  const gridStart = START_HOUR * 60
  const gridEnd = END_HOUR * 60
  const startMinutes = gridStart + slotIndex * 30
  const endMinutes = Math.min(startMinutes + durationMinutes, gridEnd)

  return {
    startTime: minutesToTime(startMinutes),
    endTime: minutesToTime(endMinutes),
  }
}

export const MODULE_DRAG_TYPE = 'application/x-schedule-module-id'
export const SEANCE_DRAG_TYPE = 'application/x-schedule-seance-id'

/** Déplace un créneau en conservant sa durée. */
export function moveTimeRange(
  startTime: string,
  endTime: string,
  newStartTime: string,
) {
  const duration = timeToMinutes(endTime) - timeToMinutes(startTime)
  const gridEnd = END_HOUR * 60
  const newStart = timeToMinutes(newStartTime)
  return {
    startTime: newStartTime,
    endTime: minutesToTime(Math.min(newStart + duration, gridEnd)),
  }
}

export function getEventPosition(startTime: string, endTime: string) {
  const startMinutes = timeToMinutes(startTime)
  const endMinutes = timeToMinutes(endTime)
  const gridStart = START_HOUR * 60

  const top = ((startMinutes - gridStart) / 30) * SLOT_HEIGHT
  const height = ((endMinutes - startMinutes) / 30) * SLOT_HEIGHT

  return { top, height }
}

export function generateTimeSlots() {
  const slots: string[] = []
  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
    slots.push(`${hour.toString().padStart(2, '0')}:30`)
  }
  return slots
}

export function formatWeekRange(startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const fmt = (d: Date) =>
    d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
  return `${fmt(start)} – ${fmt(end)}`
}

export function getWeekDays(referenceDate: Date) {
  const day = referenceDate.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(referenceDate)
  monday.setDate(referenceDate.getDate() + diff)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function getNowLinePosition() {
  const now = new Date()
  const minutes = now.getHours() * 60 + now.getMinutes()
  const gridStart = START_HOUR * 60
  const gridEnd = END_HOUR * 60

  if (minutes < gridStart || minutes > gridEnd) return null

  const top = ((minutes - gridStart) / 30) * SLOT_HEIGHT
  const label = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return { top, label }
}
