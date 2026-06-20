const SLOT_HEIGHT = 44
const COMPACT_SLOT_HEIGHT = 30
const START_HOUR = 8
const END_HOUR = 17

export type ScheduleGridConfig = {
  slotHeight: number
  startHour: number
  endHour: number
}

export const SCHEDULE_CONFIG: ScheduleGridConfig = {
  slotHeight: SLOT_HEIGHT,
  startHour: START_HOUR,
  endHour: END_HOUR,
}

export const COMPACT_SCHEDULE_CONFIG: ScheduleGridConfig = {
  slotHeight: COMPACT_SLOT_HEIGHT,
  startHour: START_HOUR,
  endHour: END_HOUR,
}

function resolveConfig(config?: ScheduleGridConfig) {
  return config ?? SCHEDULE_CONFIG
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
export function yOffsetToSlotIndex(y: number, config?: ScheduleGridConfig) {
  const { slotHeight, startHour, endHour } = resolveConfig(config)
  const maxSlot = (endHour - startHour) * 2 - 1
  return Math.max(0, Math.min(Math.floor(y / slotHeight), maxSlot))
}

export function slotIndexToTimeRange(
  slotIndex: number,
  durationMinutes = 120,
  config?: ScheduleGridConfig,
) {
  const { startHour, endHour } = resolveConfig(config)
  const gridStart = startHour * 60
  const gridEnd = endHour * 60
  const startMinutes = gridStart + slotIndex * 30
  const endMinutes = Math.min(startMinutes + durationMinutes, gridEnd)

  return {
    startTime: minutesToTime(startMinutes),
    endTime: minutesToTime(endMinutes),
  }
}

export const FORMATION_DRAG_TYPE = 'application/x-schedule-formation-id'
/** @deprecated Utiliser FORMATION_DRAG_TYPE */
export const MODULE_DRAG_TYPE = FORMATION_DRAG_TYPE
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

export function getEventPosition(
  startTime: string,
  endTime: string,
  config?: ScheduleGridConfig,
) {
  const { slotHeight, startHour } = resolveConfig(config)
  const startMinutes = timeToMinutes(startTime)
  const endMinutes = timeToMinutes(endTime)
  const gridStart = startHour * 60

  const top = ((startMinutes - gridStart) / 30) * slotHeight
  const height = ((endMinutes - startMinutes) / 30) * slotHeight

  return { top, height }
}

export function generateTimeSlots(config?: ScheduleGridConfig) {
  const { startHour, endHour } = resolveConfig(config)
  const slots: string[] = []
  for (let hour = startHour; hour < endHour; hour++) {
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

export function getNowLinePosition(config?: ScheduleGridConfig) {
  const { slotHeight, startHour, endHour } = resolveConfig(config)
  const now = new Date()
  const minutes = now.getHours() * 60 + now.getMinutes()
  const gridStart = startHour * 60
  const gridEnd = endHour * 60

  if (minutes < gridStart || minutes > gridEnd) return null

  const top = ((minutes - gridStart) / 30) * slotHeight
  const label = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return { top, label }
}

export function eventsTimeOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string,
) {
  return (
    timeToMinutes(startA) < timeToMinutes(endB) &&
    timeToMinutes(startB) < timeToMinutes(endA)
  )
}

export interface ScheduleEventLayout {
  top: number
  height: number
  leftPercent: number
  widthPercent: number
  columnIndex: number
  columnCount: number
  hasOverlap: boolean
}

type TimedEvent = {
  id: string
  startTime: string
  endTime: string
}

function buildOverlapClusters<T extends TimedEvent>(events: T[]): T[][] {
  const sorted = [...events].sort(
    (a, b) =>
      timeToMinutes(a.startTime) - timeToMinutes(b.startTime) ||
      timeToMinutes(a.endTime) - timeToMinutes(b.endTime),
  )

  const clusters: T[][] = []

  for (const event of sorted) {
    const matchingIndexes = clusters
      .map((cluster, index) =>
        cluster.some((existing) =>
          eventsTimeOverlap(
            existing.startTime,
            existing.endTime,
            event.startTime,
            event.endTime,
          ),
        )
          ? index
          : -1,
      )
      .filter((index) => index >= 0)

    if (matchingIndexes.length === 0) {
      clusters.push([event])
      continue
    }

    const merged = matchingIndexes.flatMap((index) => clusters[index]!)
    merged.push(event)

    for (const index of [...matchingIndexes].sort((a, b) => b - a)) {
      clusters.splice(index, 1)
    }

    clusters.push(merged)
  }

  return clusters
}

function assignClusterColumns<T extends TimedEvent>(
  cluster: T[],
): Map<string, { columnIndex: number; columnCount: number }> {
  const sorted = [...cluster].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
  )

  const columnEnds: number[] = []
  const assignment = new Map<string, number>()

  for (const event of sorted) {
    const start = timeToMinutes(event.startTime)
    const end = timeToMinutes(event.endTime)

    let columnIndex = columnEnds.findIndex((columnEnd) => columnEnd <= start)
    if (columnIndex === -1) {
      columnIndex = columnEnds.length
      columnEnds.push(end)
    } else {
      columnEnds[columnIndex] = end
    }

    assignment.set(event.id, columnIndex)
  }

  const columnCount = Math.max(columnEnds.length, 1)
  const result = new Map<string, { columnIndex: number; columnCount: number }>()

  for (const [eventId, columnIndex] of assignment.entries()) {
    result.set(eventId, { columnIndex, columnCount })
  }

  return result
}

/** Positionne les événements d'un même jour en colonnes lorsqu'ils se chevauchent. */
export function layoutDayEvents<T extends TimedEvent>(
  events: T[],
  config?: ScheduleGridConfig,
): Array<T & ScheduleEventLayout> {
  if (events.length === 0) return []

  const clusters = buildOverlapClusters(events)
  const layoutById = new Map<string, { columnIndex: number; columnCount: number }>()

  for (const cluster of clusters) {
    const columns = assignClusterColumns(cluster)
    for (const [eventId, layout] of columns.entries()) {
      layoutById.set(eventId, layout)
    }
  }

  return events.map((event) => {
    const { top, height } = getEventPosition(event.startTime, event.endTime, config)
    const columnLayout = layoutById.get(event.id) ?? {
      columnIndex: 0,
      columnCount: 1,
    }
    const { columnIndex, columnCount } = columnLayout
    const widthPercent = 100 / columnCount
    const leftPercent = columnIndex * widthPercent

    return {
      ...event,
      top,
      height,
      leftPercent,
      widthPercent,
      columnIndex,
      columnCount,
      hasOverlap: columnCount > 1,
    }
  })
}

export function countOverlappingEvents<T extends TimedEvent>(events: T[]): number {
  const clusters = buildOverlapClusters(events)
  return clusters.filter((cluster) => cluster.length > 1).reduce((sum, cluster) => sum + cluster.length, 0)
}
